import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, badRequest } from "@/lib/api-helpers";
import { makeId } from "@/lib/utils";
import type { Supplier } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  return NextResponse.json({ items: db.suppliers.filter((s) => s.userId === auth.user.id) });
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.url) return badRequest("name and url required");
  const db = readDB();
  const now = new Date().toISOString();
  const supplier: Supplier = {
    id: makeId("sup"), userId: auth.user.id, name: body.name.trim(),
    url: body.url.trim().replace(/^https?:\/\//, ""), category: body.category || "General",
    rating: Number(body.rating ?? 4.0), shippingDays: body.shippingDays || [7, 14],
    productsCount: 0, autoOrdering: body.autoOrdering ?? true, connectedAt: now,
  };
  db.suppliers.push(supplier);
  db.activities.unshift({ id: makeId("act"), userId: auth.user.id, type: "supplier", message: `Connected supplier "${supplier.name}"`, createdAt: now });
  writeDB(db);
  return NextResponse.json(supplier, { status: 201 });
}
