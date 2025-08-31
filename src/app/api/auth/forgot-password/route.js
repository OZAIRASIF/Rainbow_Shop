// src/app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // 1️⃣ Read JSON body safely
    const body = await req.json();
    const email = body?.email?.trim();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 2️⃣ Get MongoDB collections
    const { usersCollection } = await getCollections();

    // 3️⃣ Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5️⃣ Save OTP in DB
    await usersCollection.updateOne({ email }, { $set: { reset_otp: otp } });

    // 6️⃣ Safe environment variables
    const host = process.env.EMAIL_HOST || "";
    const port = parseInt(process.env.EMAIL_PORT || "587", 10);
    const userEnv = process.env.EMAIL_USER || "";
    const passEnv = process.env.EMAIL_PASS || "";

    if (!host || !userEnv || !passEnv) {
      console.error("Email environment variables are missing!");
      return NextResponse.json(
        { error: "Email server not configured" },
        { status: 500 }
      );
    }

    // 7️⃣ Setup nodemailer transport
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // SSL if port 465
      auth: {
        user: userEnv,
        pass: passEnv,
      },
    });

    // 8️⃣ Send OTP email
    await transporter.sendMail({
      from: userEnv,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire soon.`,
    });

    return NextResponse.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
