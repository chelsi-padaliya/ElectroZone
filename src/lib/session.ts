import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "electrozone-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.SESSION_SECRET ?? process.env.JWT_SECRET;
  if (!secret) throw new Error("SESSION_SECRET or JWT_SECRET missing in .env.local file");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({ userId, expiresAt: Date.now() + SESSION_MAX_AGE * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function getCurrentUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  try {
    const { userId, expiresAt } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof userId === "string" && typeof expiresAt === "number" && expiresAt > Date.now()
      ? userId
      : null;
  } catch {
    return null;
  }
}

export const sessionCookie = {
  name: SESSION_COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  },
};
