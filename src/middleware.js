import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const PROTECTED_ROUTES = ["/products", "/cart", "/checkout"];

export async function middleware(req) {
  const pathname = req.nextUrl?.pathname;

  // Safety check
  if (!pathname || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // Protect client routes
  if (PROTECTED_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (AUTH_ROUTES.some((p) => pathname.startsWith(p))) {
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.redirect(new URL("/products", req.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Homepage redirect to login
  if (pathname === "/") return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/", 
    "/products/:path*", 
    "/cart/:path*", 
    "/checkout/:path*", 
    "/login", 
    "/signup", 
    "/forgot-password", 
    "/reset-password",
  ],
};
