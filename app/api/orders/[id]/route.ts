import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db-server";
import { requireUser, notFound } from "@/lib/api-helpers";
import type { OrderStatus, FulfillmentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const FULFILLMENT: Record<OrderStatus, FulfillmentStatus> = {
  pending: "awaiting_order", processing: "ordered", shipped: "shipped",
  delivered: "delivered", cancelled: "failed", returned: "failed",
};

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  const order = db.orders.find((o) => o.id === params.id && o.userId === auth.user.id);
  if (!order) return notFound("Order not found");
  return NextResponse.json({ order, store: db.stores.find((s) => s.id === order.storeId) });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const i = db.orders.findIndex((o) => o.id === params.id && o.userId === auth.user.id);
  if (i === -1) return notFound("Order not found");
  const updated = { ...db.orders[i], ...body, updatedAt: new Date().toISOString() };
  if (body.status && body.status in FULFILLMENT) {
    updated.status = body.status as OrderStatus;
    updated.fulfillment = FULFILLMENT[body.status as OrderStatus];
  }
  db.orders[i] = updated;
  db.activities.unshift({ id: `act_${Date.now()}`, userId: auth.user.id, type: "order", message: `Order ${updated.orderNumber} marked as ${updated.status.replace(/_/g, " ")}`, createdAt: new Date().toISOString() });
  writeDB(db);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  const order = db.orders.find((o) => o.id === params.id && o.userId === auth.user.id);
  if (!order) return notFound("Order not found");
  db.orders = db.orders.filter((o) => o.id !== params.id);
  for (const s of db.stores) if (s.id === order.storeId) s.ordersCount = db.orders.filter((o) => o.storeId === s.id).length;
  writeDB(db);
  return NextResponse.json({ ok: true });
}
