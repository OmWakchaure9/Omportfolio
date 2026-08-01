import { NextResponse } from "next/server";
import { otpStore } from "../otpStore";

const AUTHORIZED_ADMIN_EMAIL = "omswakchaure1@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputEmail = (body.email || "").trim().toLowerCase();

    if (inputEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Incorrect Admin Email address." },
        { status: 400 }
      );
    }

    const targetEmail = AUTHORIZED_ADMIN_EMAIL.toLowerCase();
    const inputOtp = (body.otp || "").trim();

    const record = otpStore.get(targetEmail);

    if (!record) {
      return NextResponse.json(
        { success: false, error: "No active OTP found. Please request a new 6-digit OTP code." },
        { status: 400 }
      );
    }

    if (Date.now() > record.expires) {
      otpStore.delete(targetEmail);
      return NextResponse.json(
        { success: false, error: "OTP code has expired (valid for 10 mins). Please request a new OTP." },
        { status: 400 }
      );
    }

    if (record.otp !== inputOtp) {
      return NextResponse.json(
        { success: false, error: "Incorrect 6-digit OTP code. Please check your email inbox and try again." },
        { status: 400 }
      );
    }

    // Success! Delete used OTP
    otpStore.delete(targetEmail);

    return NextResponse.json({
      success: true,
      message: "OTP Verified successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "OTP verification failed" },
      { status: 500 }
    );
  }
}
