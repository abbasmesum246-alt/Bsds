import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, notFound } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const i = db.stores.findIndex((s) => s.id === params.id && s.userId === auth.user.id);
  if (i === -1) return notFound("Store not found");
  db.stores[i] = { ...db.stores[i], ...body, id: db.stores[i].id };
  writeDB(db);
  return NextResponse.json(db.stores[i]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  if (!db.stores.some((s) => s.id === params.id && s.userId === auth.user.id)) return notFound("Store not found");
  db.stores = db.stores.filter((s) => s.id !== params.id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
