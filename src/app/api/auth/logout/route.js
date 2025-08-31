import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // Clear the token cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // removes the cookie
    sameSite: "lax",
    secure: false,
  });

  return response;
}
