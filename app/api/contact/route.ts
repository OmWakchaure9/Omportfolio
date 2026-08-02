import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const AUTHORIZED_ADMIN_EMAIL = "omswakchaure1@gmail.com";
const CLOUD_MESSAGES_BLOB_URL = "https://jsonblob.com/api/jsonBlob/019fc1a5-55c3-78c6-9042-437ea0370554";

async function getStoredMessages() {
  try {
    const res = await fetch(CLOUD_MESSAGES_BLOB_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error("Error fetching stored messages:", err);
  }
  return [];
}

async function saveMessage(newMsg: any) {
  try {
    const current = await getStoredMessages();
    const updated = [newMsg, ...current];
    await fetch(CLOUD_MESSAGES_BLOB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  } catch (err) {
    console.error("Error saving message to cloud blob:", err);
  }
}

export async function GET() {
  const messages = await getStoredMessages();
  return NextResponse.json({ success: true, messages }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const msgEntry = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      subject: (subject || "New Portfolio Contact Message").trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Cloud Storage Inbox so Om can read it in Admin Panel
    await saveMessage(msgEntry);

    // 2. Send email notification via EmailJS REST API
    let sentEmail = false;
    const serviceId = "service_2s9un7e";
    const templateId = "template_fcj9nao";
    const publicKey = process.env.EMAILJS_PUBLIC_KEY || "GV2lZkC3WjUs1_LKl";

    try {
      const emailjsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: AUTHORIZED_ADMIN_EMAIL,
            from_name: name.trim(),
            from_email: email.trim(),
            reply_to: email.trim(),
            user_email: email.trim(),
            subject: subject || "New Contact Message",
            message: `New message from ${name} (${email}):\n\nSubject: ${subject || "N/A"}\n\n${message}`,
            to_name: "Om Santosh Wakchaure",
          },
        }),
      });

      if (emailjsRes.ok) {
        sentEmail = true;
      } else {
        const errTxt = await emailjsRes.text();
        console.error("EmailJS contact email response:", errTxt);
      }
    } catch (err) {
      console.error("EmailJS fetch error:", err);
    }

    // 3. Fallback: Nodemailer if SMTP configured
    if (!sentEmail && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${process.env.SMTP_EMAIL}>`,
          to: AUTHORIZED_ADMIN_EMAIL,
          replyTo: email.trim(),
          subject: `📩 Portfolio Enquiry: ${subject || "New Message from " + name}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #030712; color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #38bdf8;">
              <h2 style="color: #c084fc;">New Portfolio Contact Message</h2>
              <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
              <p><strong>Subject:</strong> ${subject || "N/A"}</p>
              <div style="background: #0f172a; border: 1px solid #38bdf8; border-radius: 12px; padding: 16px; margin: 20px 0; white-space: pre-wrap;">
                ${message}
              </div>
              <p style="color: #94a3b8; font-size: 12px;">Submitted on ${new Date().toLocaleString()}</p>
            </div>
          `,
        });
        sentEmail = true;
      } catch (err) {
        console.error("Nodemailer contact error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Message transmitted successfully!",
      savedToInbox: true,
      sentEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
