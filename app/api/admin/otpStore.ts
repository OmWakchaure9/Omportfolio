// Shared server-side memory store for Admin OTPs
export const otpStore = new Map<string, { otp: string; expires: number }>();
