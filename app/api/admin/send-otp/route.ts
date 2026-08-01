import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "../otpStore";

const AUTHORIZED_ADMIN_EMAIL = "omswakchaure1@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputEmail = (body.email || "").trim().toLowerCase();

    // 1. STRICT AUTHORIZED EMAIL CHECK
    if (!inputEmail || inputEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: `Access Denied: "${body.email || "Unknown"}" is NOT an authorized admin email. OTP can ONLY be requested for ${AUTHORIZED_ADMIN_EMAIL}.`,
        },
        { status: 400 }
      );
    }

    const targetEmail = AUTHORIZED_ADMIN_EMAIL;

    // Service details provided by user
    const serviceId = body.serviceId || "service_2s9un7e";
    const templateId = body.templateId || "template_fcj9nao";
    const publicKey = body.publicKey || process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "GV2lZkC3WjUs1_LKl";

    const senderEmail = body.smtpEmail || process.env.SMTP_EMAIL || AUTHORIZED_ADMIN_EMAIL;
    const senderPassword = body.smtpPassword || process.env.SMTP_PASSWORD;

    // Generate 6-digit random security OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

    // Store OTP securely on server side
    otpStore.set(targetEmail.toLowerCase(), { otp: generatedOtp, expires });

    let sentViaEmailJS = false;
    let sentViaNodemailer = false;

    // 2. Try sending via EmailJS REST API using user's Service ID & Template ID & Public Key
    if (serviceId && templateId && publicKey) {
      try {
        const payload = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: targetEmail,
            email: targetEmail,
            user_email: targetEmail,
            reply_to: targetEmail,
            to_name: "Om Santosh Wakchaure",
            otp: generatedOtp,
            otp_code: generatedOtp,
            code: generatedOtp,
            passcode: generatedOtp,
            security_code: generatedOtp,
            message: `Your 6-Digit Admin Passcode Reset OTP is: ${generatedOtp}`,
          },
        };

        const emailjsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (emailjsRes.ok) {
          sentViaEmailJS = true;
        } else {
          const errText = await emailjsRes.text();
          console.error("EmailJS REST response:", errText);
        }
      } catch (e: any) {
        console.error("EmailJS fetch error:", e);
      }
    }

    // 3. Try sending via Nodemailer if SMTP configured
    if (!sentViaEmailJS && senderEmail && senderPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: senderEmail,
            pass: senderPassword,
          },
        });

        await transporter.sendMail({
          from: `"Om Portfolio Admin Security" <${senderEmail}>`,
          to: targetEmail,
          subject: "🔒 Admin Security Passcode Reset 6-Digit OTP",
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #030712; color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #38bdf8;">
              <h2 style="color: #c084fc; text-align: center;">Om's Portfolio Admin Security</h2>
              <p>Hello Om,</p>
              <p>Your 6-digit security OTP code for Admin Management Panel reset is:</p>
              <div style="background: #0f172a; border: 1px solid #38bdf8; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #38bdf8;">${generatedOtp}</span>
              </div>
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">This OTP is valid for 10 minutes. Do not share this security code with anyone.</p>
            </div>
          `,
        });
        sentViaNodemailer = true;
      } catch (err: any) {
        console.error("Nodemailer error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      sentViaEmailJS,
      sentViaNodemailer,
      otpForClientSend: (!sentViaEmailJS && !sentViaNodemailer) ? generatedOtp : undefined,
      message: `6-Digit Security OTP processed for ${targetEmail}. Check your email inbox.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process OTP request" },
      { status: 500 }
    );
  }
}
