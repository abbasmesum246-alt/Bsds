import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db-server";
import { requireUser, notFound } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const i = db.rules.findIndex((r) => r.id === params.id && r.userId === auth.user.id);
  if (i === -1) return notFound("Rule not found");
  db.rules[i] = { ...db.rules[i], ...body, id: db.rules[i].id };
  writeDB(db);
  return NextResponse.json(db.rules[i]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  if (!db.rules.some((r) => r.id === params.id && r.userId === auth.user.id)) return notFound("Rule not found");
  db.rules = db.rules.filter((r) => r.id !== params.id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
