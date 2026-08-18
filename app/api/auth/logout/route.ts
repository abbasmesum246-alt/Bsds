import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) destroySession(token);
  cookies().delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
