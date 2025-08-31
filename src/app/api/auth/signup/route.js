import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();

    const { usersCollection } = await getCollections();

    // check if user already exists
    const existing = await usersCollection.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    await usersCollection.insertOne({
      email,
      username,
      password: hashedPassword,
    });

    return NextResponse.json({ msg: "User registered successfully" }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
