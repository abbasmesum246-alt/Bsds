import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, notFound } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  const product = db.products.find((p) => p.id === params.id && p.userId === auth.user.id);
  if (!product) return notFound("Product not found");
  return NextResponse.json({ product, store: db.stores.find((s) => s.id === product.storeId), supplier: db.suppliers.find((s) => s.id === product.supplierId) });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const i = db.products.findIndex((p) => p.id === params.id && p.userId === auth.user.id);
  if (i === -1) return notFound("Product not found");
  const cur = db.products[i];
  const prevStatus = cur.status;
  const updated = { ...cur, ...body, id: cur.id, userId: cur.userId, updatedAt: new Date().toISOString() };
  for (const k of ["compareAtPrice", "sellPrice", "costPrice", "quantity", "sold", "variants", "rating", "reviews"] as const) {
    if (body[k] !== undefined) (updated as Record<string, unknown>)[k] = Number(body[k]);
  }
  if (updated.quantity === 0 && updated.status === "active") updated.status = "out_of_stock";
  if (updated.quantity > 0 && updated.status === "out_of_stock") updated.status = "active";
  db.products[i] = updated;
  if (prevStatus !== updated.status) {
    db.activities.unshift({ id: makeIdLocal(), userId: auth.user.id, type: "stock", message: `"${updated.title}" is now ${updated.status.replace(/_/g, " ")}`, createdAt: new Date().toISOString() });
  }
  writeDB(db);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  const product = db.products.find((p) => p.id === params.id && p.userId === auth.user.id);
  if (!product) return notFound("Product not found");
  db.products = db.products.filter((p) => p.id !== params.id);
  for (const s of db.stores) if (s.id === product.storeId) s.productsCount = db.products.filter((p) => p.storeId === s.id).length;
  for (const s of db.suppliers) if (s.id === product.supplierId) s.productsCount = db.products.filter((p) => p.supplierId === s.id).length;
  writeDB(db);
  return NextResponse.json({ ok: true });
}

function makeIdLocal() {
  return `act_${Math.random().toString(36).slice(2, 10)}`;
}
