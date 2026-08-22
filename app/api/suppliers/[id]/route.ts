import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db-server";
import { requireUser, notFound } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const i = db.suppliers.findIndex((s) => s.id === params.id && s.userId === auth.user.id);
  if (i === -1) return notFound("Supplier not found");
  db.suppliers[i] = { ...db.suppliers[i], ...body, id: db.suppliers[i].id };
  writeDB(db);
  return NextResponse.json(db.suppliers[i]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  if (!db.suppliers.some((s) => s.id === params.id && s.userId === auth.user.id)) return notFound("Supplier not found");
  db.suppliers = db.suppliers.filter((s) => s.id !== params.id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
