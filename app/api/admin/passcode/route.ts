import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PASSCODE_FILE_PATH = path.join(process.cwd(), "data", "adminPasscode.json");

const DEFAULT_PIN = "OmAdminPasscode";

// Server-side cache
let cachedPin: string | null = null;

function getStoredPin(): string {
  if (cachedPin) {
    return cachedPin;
  }
  try {
    if (fs.existsSync(PASSCODE_FILE_PATH)) {
      const content = fs.readFileSync(PASSCODE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && parsed.pin) {
        cachedPin = parsed.pin;
        return cachedPin as string;
      }
    }
  } catch (err) {
    console.error("Error reading adminPasscode.json:", err);
  }
  cachedPin = DEFAULT_PIN;
  return DEFAULT_PIN;
}

function saveStoredPin(newPin: string): boolean {
  cachedPin = newPin;
  try {
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(PASSCODE_FILE_PATH, JSON.stringify({ pin: newPin, updatedAt: new Date().toISOString() }, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving adminPasscode.json:", err);
    return false;
  }
}

export async function GET() {
  // Return whether custom pin is set (do not expose pin plaintext in raw GET for security)
  const currentPin = getStoredPin();
  const isDefault = currentPin === DEFAULT_PIN;
  return NextResponse.json({ success: true, isDefault });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, passcode, newPin } = body;

    const currentPin = getStoredPin();

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

      const saved = saveStoredPin(newPin.trim());
      return NextResponse.json({
        success: saved,
        message: saved ? "Admin PIN updated globally across all devices!" : "PIN updated in server memory",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process request" }, { status: 500 });
  }
}
