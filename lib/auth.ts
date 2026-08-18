import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { readDB, writeDB } from "./db";
import type { SafeUser, User } from "./types";

const COOKIE = "bsds_session";
const COLORS = ["#3563ff", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626", "#db2777", "#4f46e5"];

export function toSafeUser(u: User): SafeUser {
  const { passwordHash: _ph, ...safe } = u;
  return safe;
}
export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}
export function createSession(userId: string): string {
  const token = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const db = readDB();
  db.sessions[token] = { userId, createdAt: new Date().toISOString() };
  writeDB(db);
  return token;
}
export function destroySession(token: string) {
  const db = readDB();
  delete db.sessions[token];
  writeDB(db);
}
export function getCurrentUser(): SafeUser | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const db = readDB();
  const session = db.sessions[token];
  if (!session) return null;
  const user = db.users.find((u) => u.id === session.userId);
  return user ? toSafeUser(user) : null;
}
export function pickAvatarColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
export const COOKIE_OPTS = {
  httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30,
};
export const COOKIE_NAME = COOKIE;
