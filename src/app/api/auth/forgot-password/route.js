import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const { usersCollection } = await getCollections();

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    await usersCollection.updateOne(
      { email },
      { $set: { reset_otp: otp } }
    );

    // Setup email transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire soon.`,
    });

    return NextResponse.json({ msg: "OTP sent successfully to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
