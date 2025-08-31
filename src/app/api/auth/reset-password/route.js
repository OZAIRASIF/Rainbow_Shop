import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, otp, new_password } = await req.json();
    const { usersCollection } = await getCollections();

    // Find user with OTP
    const user = await usersCollection.findOne({ email });
    if (!user || !user.reset_otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP request" },
        { status: 400 }
      );
    }

    // Validate OTP
    if (user.reset_otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(new_password);

    // Update password and remove OTP
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
