// src/app/api/auth/reset-password/route.js
import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    // 1️⃣ Read request body safely
    const body = await req.json();
    const email = body?.email?.trim();
    const otp = body?.otp?.trim();
    const newPassword = body?.new_password;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Get MongoDB collections
    const { usersCollection } = await getCollections();

    // 3️⃣ Find user with OTP
    const user = await usersCollection.findOne({ email });
    if (!user || !user.reset_otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP request" },
        { status: 400 }
      );
    }

    // 4️⃣ Validate OTP
    if (user.reset_otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // 5️⃣ Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 6️⃣ Update password and remove OTP
    await usersCollection.updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { reset_otp: "" },
      }
    );

    return NextResponse.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
