import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PASSCODE_FILE_PATH = path.join(process.cwd(), "data", "adminPasscode.json");
const CLOUD_PASSCODE_BLOB_URL = "https://jsonblob.com/api/jsonBlob/019fc192-e3b6-7d26-807a-acbc1c3dd755";
const DEFAULT_PIN = "OmAdminPasscode";

let cachedPin: string | null = null;

async function getStoredPin(): Promise<string> {
  // 1. Fetch from Cloud Persistent Store so all devices/serverless containers get the same PIN
  try {
    const cloudRes = await fetch(CLOUD_PASSCODE_BLOB_URL, { cache: "no-store" });
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData && cloudData.pin) {
        cachedPin = cloudData.pin;
        return cloudData.pin;
      }
    }
  } catch (err) {
    console.error("Cloud passcode fetch error:", err);
  }

  // 2. Fallback to memory cache
  if (cachedPin) return cachedPin;

  // 3. Fallback to local disk file
  try {
    if (fs.existsSync(PASSCODE_FILE_PATH)) {
      const content = fs.readFileSync(PASSCODE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && parsed.pin) {
        cachedPin = parsed.pin;
        return cachedPin as string;
      }
    }
  } catch (err) {}

  cachedPin = DEFAULT_PIN;
  return DEFAULT_PIN;
}

async function saveStoredPin(newPin: string): Promise<boolean> {
  cachedPin = newPin;

  // 1. Save to Cloud Persistent Store
  try {
    await fetch(CLOUD_PASSCODE_BLOB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: newPin, updatedAt: new Date().toISOString() }),
    });
  } catch (err) {
    console.error("Cloud passcode update error:", err);
  }

  // 2. Save to local disk file
  try {
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(PASSCODE_FILE_PATH, JSON.stringify({ pin: newPin, updatedAt: new Date().toISOString() }, null, 2), "utf-8");
  } catch (err) {}

  return true;
}

export async function GET() {
  const currentPin = await getStoredPin();
  const isDefault = currentPin === DEFAULT_PIN;
  return NextResponse.json({ success: true, isDefault }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, passcode, newPin } = body;

    const currentPin = await getStoredPin();

    if (action === "verify") {
      const isValid = (passcode || "").trim() === currentPin.trim();
      return NextResponse.json({
        success: isValid,
        message: isValid ? "Access Granted" : "Incorrect PIN passcode",
      });
    }

    if (action === "update") {
      if (!newPin || typeof newPin !== "string" || newPin.trim().length === 0) {
        return NextResponse.json({ success: false, error: "New PIN passcode cannot be empty" }, { status: 400 });
      }

      const saved = await saveStoredPin(newPin.trim());
      return NextResponse.json({
        success: saved,
        message: "Admin PIN updated globally across all devices!",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process request" }, { status: 500 });
  }
}
