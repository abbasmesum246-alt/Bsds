import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, badRequest } from "@/lib/api-helpers";
import { makeId } from "@/lib/utils";
import type { Product, ProductStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const db = readDB();
  let items = db.products.filter((p) => p.userId === auth.user.id);
  const q = searchParams.get("q")?.toLowerCase();
  if (q) items = items.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  const status = searchParams.get("status");
  if (status) items = items.filter((p) => p.status === status);
  const storeId = searchParams.get("storeId");
  if (storeId) items = items.filter((p) => p.storeId === storeId);
  const supplierId = searchParams.get("supplierId");
  if (supplierId) items = items.filter((p) => p.supplierId === supplierId);
  const sort = searchParams.get("sort") || "updated";
  const dir = searchParams.get("dir") === "asc" ? 1 : -1;
  items = [...items].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title) * dir;
    if (sort === "price") return (a.sellPrice - b.sellPrice) * dir;
    if (sort === "stock") return (a.quantity - b.quantity) * dir;
    if (sort === "sold") return (a.sold - b.sold) * dir;
    return (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) * dir;
  });
  return NextResponse.json({ items, total: items.length });
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as Partial<Product>;
  if (!body.title || !body.storeId || !body.supplierId) return badRequest("title, storeId, supplierId required");
  const db = readDB();
  const store = db.stores.find((s) => s.id === body.storeId && s.userId === auth.user.id);
  const supplier = db.suppliers.find((s) => s.id === body.supplierId && s.userId === auth.user.id);
  if (!store || !supplier) return badRequest("Invalid store or supplier");
  const now = new Date().toISOString();
  const cost = Number(body.costPrice ?? 0);
  const sell = Number(body.sellPrice ?? 0);
  const product: Product = {
    id: makeId("prd"), userId: auth.user.id, storeId: body.storeId, supplierId: body.supplierId,
    title: body.title.trim(), sku: body.sku?.trim() || `BSDS-${Date.now().toString(36).toUpperCase()}`,
    image: body.image || `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='%23eef2ff'/><text x='50%' y='50%' font-size='140' text-anchor='middle' dominant-baseline='middle' fill='%233563ff'>${body.title[0].toUpperCase()}</text></svg>`)}`,
    category: body.category || "General", compareAtPrice: Number(body.compareAtPrice ?? sell * 1.3),
    sellPrice: sell, costPrice: cost, quantity: Number(body.quantity ?? 0), sold: Number(body.sold ?? 0),
    status: (body.status as ProductStatus) || "active", sourceUrl: body.sourceUrl || `https://${supplier.url}/item/new`,
    tags: body.tags || [], variants: Number(body.variants ?? 1), rating: Number(body.rating ?? 0), reviews: Number(body.reviews ?? 0),
    priceMonitor: body.priceMonitor ?? true, stockMonitor: body.stockMonitor ?? true, autoReprice: body.autoReprice ?? false,
    createdAt: now, updatedAt: now,
  };
  db.products.push(product);
  store.productsCount = db.products.filter((p) => p.storeId === store.id).length;
  supplier.productsCount = db.products.filter((p) => p.supplierId === supplier.id).length;
  db.activities.unshift({ id: makeId("act"), userId: auth.user.id, type: "product", message: `Imported "${product.title}" to ${store.name}`, createdAt: now });
  writeDB(db);
  return NextResponse.json(product, { status: 201 });
}
