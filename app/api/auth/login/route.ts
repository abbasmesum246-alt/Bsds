import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readDB } from "@/lib/db";
import { verifyPassword, createSession, toSafeUser, COOKIE_OPTS, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return NextResponse.json({ error: "No account found" }, { status: 401 });
  if (!(await verifyPassword(password, user.passwordHash))) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  const token = createSession(user.id);
  const res = NextResponse.json({ user: toSafeUser(user) });
  cookies().set(COOKIE_NAME, token, COOKIE_OPTS);
  return res;
}
