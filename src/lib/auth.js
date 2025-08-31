import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET;
const ALGORITHM = process.env.ALGORITHM || "HS256";
const ACCESS_TOKEN_EXPIRE_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES) || 60;

// ✅ Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// ✅ Verify password
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// ✅ Create JWT token
export function createAccessToken(data, expiresIn = `${ACCESS_TOKEN_EXPIRE_MINUTES}m`) {
  return jwt.sign(data, SECRET_KEY, { algorithm: ALGORITHM, expiresIn });
}

// ✅ Decode + Verify JWT (for Authorization headers, optional)
export function decodeAccessToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });
  } catch (err) {
    return null;
  }
}

// ✅ Get current user from HTTP-only cookie
export async function getCurrentUser(req) {
  // Read token from cookies
  const token = req.cookies?.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    return payload.sub; // Assuming username is stored in `sub`
  } catch (err) {
    throw new Error("Unauthorized");
  }
}
