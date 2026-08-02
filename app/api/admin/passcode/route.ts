import { NextResponse } from "next/server";

const DEFAULT_PIN = "OmAdminPasscode";
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let memoryPin: string | null = null;

async function getPinFromUpstash() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/admin_passcode_v1`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        return typeof data.result === "string" ? data.result : String(data.result);
      }
    }
  } catch (err) {
    console.error("Upstash GET passcode error:", err);
  }
  return null;
}

async function setPinInUpstash(pin: string) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const res = await fetch(`${UPSTASH_URL}/set/admin_passcode_v1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: pin,
    });
    return res.ok;
  } catch (err) {
    console.error("Upstash SET passcode error:", err);
    return false;
  }
}

export async function GET() {
  try {
    const cloudPin = await getPinFromUpstash();
    const currentPin = cloudPin || memoryPin || DEFAULT_PIN;
    return NextResponse.json({ success: true, pin: currentPin });
  } catch {
    return NextResponse.json({ success: true, pin: DEFAULT_PIN });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, currentPin, newPin } = body;

    const cloudPin = await getPinFromUpstash();
    const activePin = cloudPin || memoryPin || DEFAULT_PIN;

    if (action === "verify") {
      const isValid = currentPin === activePin;
      return NextResponse.json({ success: isValid });
    }

    if (action === "update") {
      if (!newPin || typeof newPin !== "string" || newPin.trim().length < 4) {
        return NextResponse.json(
          { success: false, error: "New passcode must be at least 4 characters long." },
          { status: 400 }
        );
      }

      memoryPin = newPin.trim();
      await setPinInUpstash(memoryPin);

      return NextResponse.json({
        success: true,
        message: "Admin passcode updated and synced globally!",
        pin: memoryPin,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action type." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Passcode operation failed." },
      { status: 500 }
    );
  }
}
