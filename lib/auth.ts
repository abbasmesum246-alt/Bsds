import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { readDB, writeDB } from "./db-server";
import type { SafeUser, User } from "./types";

const COOKIE = "bsds_session";
const COLORS = ["#3563ff", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626", "#db2777", "#4f46e5"];

// JWT-style stateless session. Signed with HMAC using BSDS_SECRET (or a
// deterministic dev key). On serverless hosts this means the session survives
// even if in-memory/file state resets — no more random logouts.
const SECRET = process.env.BSDS_SECRET || "bsds-dev-secret-change-me-in-production-v1";
const SESSION_DAYS = 30;

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}
function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function toSafeUser(u: User): SafeUser {
  const { passwordHash: _ph, ...safe } = u;
  return safe;
}
export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}
export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export interface SessionClaims {
  sub: string;       // user id
  email: string;
  iat: number;
  exp: number;
}

export function createSessionToken(userId: string, email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const claims: SessionClaims = {
    sub: userId,
    email,
    iat: now,
    exp: now + 60 * 60 * 24 * SESSION_DAYS,
  };
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(claims));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): SessionClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = sign(`${header}.${body}`);
    // constant-time compare
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const claims = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionClaims;
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

// Legacy: still record sessions in DB for revocation/admin lists, but auth
// works even if this is missing (e.g. fresh serverless instance).
export function createSession(userId: string): string {
  try {
    const db = readDB();
    const token = "sess_" + crypto.randomBytes(16).toString("hex");
    db.sessions[token] = { userId, createdAt: new Date().toISOString() };
    writeDB(db);
    return token;
  } catch {
    return "sess_legacy";
  }
}
export function destroySession(_token: string) {
  try {
    const db = readDB();
    // Best-effort; JWT stateless auth means logout clears the cookie.
    writeDB(db);
  } catch { /* ignore */ }
}

export function getCurrentUser(): SafeUser | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;

  // Try JWT first (new sessions)
  const claims = verifyToken(token);
  if (claims) {
    const db = readDB();
    const user = db.users.find((u) => u.id === claims.sub);
    if (user) return toSafeUser(user);
  }

  // Fall back to legacy DB sessions
  try {
    const db = readDB();
    const session = db.sessions[token];
    if (session) {
      const user = db.users.find((u) => u.id === session.userId);
      if (user) return toSafeUser(user);
    }
  } catch { /* ignore */ }
  return null;
}

export function pickAvatarColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * SESSION_DAYS,
};
export const COOKIE_NAME = COOKIE;
