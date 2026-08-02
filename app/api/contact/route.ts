import { NextResponse } from "next/server";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let memoryMessages: any[] = [];

async function getMessagesFromUpstash(): Promise<any[]> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return memoryMessages;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/portfolio_contact_inbox_v1`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result;
        return Array.isArray(parsed) ? parsed : [];
      }
    }
  } catch (err) {
    console.error("Upstash GET contact inbox error:", err);
  }
  return memoryMessages;
}

async function setMessagesInUpstash(messages: any[]) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const res = await fetch(`${UPSTASH_URL}/set/portfolio_contact_inbox_v1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(messages),
    });
    return res.ok;
  } catch (err) {
    console.error("Upstash SET contact inbox error:", err);
    return false;
  }
}

export async function GET() {
  try {
    const messages = await getMessagesFromUpstash();
    return NextResponse.json({ success: true, messages }, {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  } catch {
    return NextResponse.json({ success: true, messages: memoryMessages });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required contact form fields." },
        { status: 400 }
      );
    }

    const newMessage = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || "General Inquiry").trim(),
      message: String(message).trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const currentMessages = await getMessagesFromUpstash();
    const updatedMessages = [newMessage, ...currentMessages];
    memoryMessages = updatedMessages;

    await setMessagesInUpstash(updatedMessages);

    return NextResponse.json({
      success: true,
      message: "Contact message received and saved to Admin Panel inbox!",
      data: newMessage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process contact submission." },
      { status: 500 }
    );
  }
}
