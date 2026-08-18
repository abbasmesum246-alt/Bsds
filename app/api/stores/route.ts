import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, badRequest } from "@/lib/api-helpers";
import { makeId } from "@/lib/utils";
import type { Store, Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  return NextResponse.json({ items: db.stores.filter((s) => s.userId === auth.user.id) });
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.platform) return badRequest("name and platform required");
  const db = readDB();
  const now = new Date().toISOString();
  const store: Store = {
    id: makeId("sto"), userId: auth.user.id, name: body.name.trim(),
    platform: body.platform as Platform, url: body.url || "", status: "connected",
    productsCount: 0, ordersCount: 0, revenue: 0, currency: body.currency || "USD", connectedAt: now,
  };
  db.stores.push(store);
  db.activities.unshift({ id: makeId("act"), userId: auth.user.id, type: "store", message: `Connected store "${store.name}" (${store.platform})`, createdAt: now });
  writeDB(db);
  return NextResponse.json(store, { status: 201 });
}
