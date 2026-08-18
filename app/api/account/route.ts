import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, badRequest } from "@/lib/api-helpers";
import { hashPassword, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const i = db.users.findIndex((u) => u.id === auth.user.id);
  if (i === -1) return badRequest("User not found");
  const user = db.users[i];
  if (body.name) user.name = String(body.name).trim();
  if (body.company !== undefined) user.company = String(body.company).trim();
  if (body.newPassword) {
    if (!body.currentPassword) return badRequest("Current password required");
    if (!(await verifyPassword(body.currentPassword, user.passwordHash))) return badRequest("Current password incorrect");
    if (String(body.newPassword).length < 6) return badRequest("Password must be at least 6 characters");
    user.passwordHash = await hashPassword(String(body.newPassword));
  }
  writeDB(db);
  return NextResponse.json({ ok: true });
}
