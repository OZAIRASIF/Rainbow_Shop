import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { verifyPassword, createAccessToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const { usersCollection } = await getCollections();

    const user = await usersCollection.findOne({ username });
    if (!user) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    const token = createAccessToken({ sub: user.username }, "100m");

    const response = NextResponse.json({ message: "Login successful" });

    // ✅ Set HTTP-only cookie for localhost
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 100 * 60,
      sameSite: "lax",
      secure: false, // must be false in dev
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
