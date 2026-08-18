import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, badRequest } from "@/lib/api-helpers";
import { makeId } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const db = readDB();
  let items = db.orders.filter((o) => o.userId === auth.user.id);
  const q = searchParams.get("q")?.toLowerCase();
  if (q) items = items.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q) || (o.trackingNumber || "").toLowerCase().includes(q));
  const status = searchParams.get("status") as OrderStatus | null;
  if (status) items = items.filter((o) => o.status === status);
  const storeId = searchParams.get("storeId");
  if (storeId) items = items.filter((o) => o.storeId === storeId);
  const sort = searchParams.get("sort") || "date";
  const dir = searchParams.get("dir") === "asc" ? 1 : -1;
  items = [...items].sort((a, b) => {
    if (sort === "total") return (a.total - b.total) * dir;
    if (sort === "customer") return a.customerName.localeCompare(b.customerName) * dir;
    return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * dir;
  });
  return NextResponse.json({ items, total: items.length });
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const { storeId, customerName, customerEmail, shippingAddress, items: lineItems } = body as {
    storeId?: string; customerName?: string; customerEmail?: string; shippingAddress?: string;
    items?: { productId: string; quantity: number }[];
  };
  if (!storeId || !customerName || !customerEmail || !lineItems?.length)
    return badRequest("storeId, customer details and items required");
  const db = readDB();
  const store = db.stores.find((s) => s.id === storeId && s.userId === auth.user.id);
  if (!store) return badRequest("Invalid store");
  const now = new Date().toISOString();
  let subtotal = 0, cost = 0;
  const items = lineItems.map((li) => {
    const p = db.products.find((x) => x.id === li.productId);
    if (!p) throw new Error("Invalid product");
    subtotal += p.sellPrice * li.quantity;
    cost += p.costPrice * li.quantity;
    return { productId: p.id, title: p.title, image: p.image, sku: p.sku, quantity: li.quantity, sellPrice: p.sellPrice, costPrice: p.costPrice };
  });
  const shipping = 4.99;
  const total = Math.round((subtotal + shipping) * 100) / 100;
  const count = db.orders.filter((o) => o.userId === auth.user.id).length;
  const order: Order = {
    id: makeId("ord"), userId: auth.user.id, storeId, orderNumber: `#BSDS-${100000 + count + 1}`,
    customerName, customerEmail, shippingAddress: shippingAddress || "", items,
    subtotal: Math.round(subtotal * 100) / 100, shipping, total,
    profit: Math.round((subtotal - cost) * 100) / 100, status: "pending", fulfillment: "awaiting_order",
    currency: "USD", createdAt: now, updatedAt: now,
  };
  db.orders.unshift(order);
  store.ordersCount = db.orders.filter((o) => o.storeId === store.id).length;
  db.activities.unshift({ id: makeId("act"), userId: auth.user.id, type: "order", message: `New order ${order.orderNumber} from ${customerName} — $${total}`, createdAt: now });
  writeDB(db);
  return NextResponse.json(order, { status: 201 });
}
