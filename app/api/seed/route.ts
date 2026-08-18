import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { buildSeed } from "@/scripts/seed-data";

export async function POST() {
  const db = buildSeed();
  writeDB(db);
  return NextResponse.json({ ok: true, ...count(db) });
}
export async function GET() {
  const db = readDB();
  if (db.users.length === 0) {
    const seeded = buildSeed();
    writeDB(seeded);
    return NextResponse.json({ seeded: true, ...count(seeded) });
  }
  return NextResponse.json({ seeded: false, ...count(db) });
}
// Ensure demo data exists before any dashboard API call (runs on cold start).
export const dynamic = "force-dynamic";
function count(db: ReturnType<typeof readDB>) {
  return {
    counts: {
      users: db.users.length, products: db.products.length, orders: db.orders.length,
      stores: db.stores.length, suppliers: db.suppliers.length, rules: db.rules.length,
    },
  };
}
