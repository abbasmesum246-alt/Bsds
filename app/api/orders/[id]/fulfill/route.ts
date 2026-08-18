import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, notFound } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  const i = db.orders.findIndex((o) => o.id === params.id && o.userId === auth.user.id);
  if (i === -1) return notFound("Order not found");
  const trackingNumber = `1Z${Math.floor(100000 + Math.random() * 899999)}${Math.floor(10 + Math.random() * 89)}`;
  const sourceOrderId = `ALI${Math.floor(100000000 + Math.random() * 899999999)}`;
  const updated = { ...db.orders[i], status: "shipped" as const, fulfillment: "shipped" as const, trackingNumber, sourceOrderId, updatedAt: new Date().toISOString() };
  db.orders[i] = updated;
  db.activities.unshift({ id: `act_${Date.now()}`, userId: auth.user.id, type: "automation", message: `Order ${updated.orderNumber} auto-fulfilled — tracking ${trackingNumber}`, createdAt: new Date().toISOString() });
  writeDB(db);
  return NextResponse.json(updated);
}
