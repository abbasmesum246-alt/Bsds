import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireUser, badRequest } from "@/lib/api-helpers";
import { makeId } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const SAMPLES = [
  { title: "LED Sunset Projection Lamp", cost: 7.4, emoji: "🌅", cat: "Home" },
  { title: "Mini Portable Photo Printer", cost: 24.0, emoji: "🖨️", cat: "Electronics" },
  { title: "Cloud Slippers Pillow Slides", cost: 4.2, emoji: "☁️", cat: "Home" },
  { title: "Reusable Glass Bubble Tea Cup", cost: 5.8, emoji: "🧋", cat: "Home" },
  { title: "Magnetic Cable Clips 6-Pack", cost: 2.4, emoji: "🧲", cat: "Electronics" },
  { title: "Posture Corrector Back Brace", cost: 6.9, emoji: "🧍", cat: "Fitness" },
  { title: "Silicone Food Storage Bags 10-Pack", cost: 7.1, emoji: "🥡", cat: "Home" },
  { title: "Pet Hair Remover Roller Reusable", cost: 3.6, emoji: "🐾", cat: "Pets" },
  { title: "Touchless Soap Dispenser USB-C", cost: 9.9, emoji: "🧼", cat: "Home" },
  { title: "Car Seat Gap Filler Organizer", cost: 5.5, emoji: "🚗", cat: "Outdoors" },
];

function img(emoji: string, seed: number) {
  const hues = [220, 260, 180, 340, 30, 150];
  const h = hues[seed % hues.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},70%,92%)'/><stop offset='1' stop-color='hsl(${(h + 40) % 360},65%,82%)'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='50%' y='52%' font-size='170' text-anchor='middle' dominant-baseline='middle'>${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const { url, storeId, supplierId } = (await req.json().catch(() => ({}))) as { url?: string; storeId?: string; supplierId?: string };
  if (!url) return badRequest("URL required");
  if (!storeId || !supplierId) return badRequest("storeId and supplierId required");
  const db = readDB();
  const store = db.stores.find((s) => s.id === storeId && s.userId === auth.user.id);
  const supplier = db.suppliers.find((s) => s.id === supplierId && s.userId === auth.user.id);
  if (!store || !supplier) return badRequest("Invalid store or supplier");
  const sample = SAMPLES[url.length % SAMPLES.length];
  const now = new Date().toISOString();
  const cost = sample.cost;
  const sell = Math.round(cost * 1.9 * 100) / 100;
  const product: Product = {
    id: makeId("prd"), userId: auth.user.id, storeId, supplierId, title: sample.title,
    sku: `BSDS-${sample.cat.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`,
    image: img(sample.emoji, url.length * 7), category: sample.cat,
    compareAtPrice: Math.round(sell * 1.4 * 100) / 100, sellPrice: sell, costPrice: cost,
    quantity: 50 + Math.floor(Math.random() * 200), sold: Math.floor(Math.random() * 120),
    status: "active", sourceUrl: url, tags: ["trending", "new-import"], variants: 1 + Math.floor(Math.random() * 4),
    rating: Math.round((3.8 + Math.random() * 1.1) * 10) / 10, reviews: Math.floor(20 + Math.random() * 900),
    priceMonitor: true, stockMonitor: true, autoReprice: false, createdAt: now, updatedAt: now,
  };
  db.products.push(product);
  store.productsCount = db.products.filter((p) => p.storeId === store.id).length;
  supplier.productsCount = db.products.filter((p) => p.supplierId === supplier.id).length;
  let host = url;
  try { host = new URL(url).hostname; } catch { /* keep raw */ }
  db.activities.unshift({ id: makeId("act"), userId: auth.user.id, type: "product", message: `Imported "${product.title}" from ${host}`, createdAt: now });
  writeDB(db);
  return NextResponse.json(product, { status: 201 });
}
