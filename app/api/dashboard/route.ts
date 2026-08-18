import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";
import { lastNDays } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  const { user } = auth;
  const products = db.products.filter((p) => p.userId === user.id);
  const orders = db.orders.filter((o) => o.userId === user.id);
  const stores = db.stores.filter((s) => s.userId === user.id);

  const now = Date.now();
  const d30 = 30 * 86400000;
  const inCur = (iso: string) => now - new Date(iso).getTime() <= d30;
  const inPrev = (iso: string) => {
    const t = now - new Date(iso).getTime();
    return t > d30 && t <= d30 * 2;
  };
  const curOrders = orders.filter((o) => inCur(o.createdAt));
  const prevOrders = orders.filter((o) => inPrev(o.createdAt));
  const rev = (arr: typeof orders) => arr.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const prof = (arr: typeof orders) => arr.reduce((s, o) => s + o.profit, 0);
  const pct = (c: number, p: number) => (p === 0 ? (c > 0 ? 100 : 0) : ((c - p) / p) * 100);

  const days = lastNDays(14);
  const revenueSeries = days.map((day) => {
    const start = new Date(day).getTime();
    const end = start + 86400000;
    const dayOrders = orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= start && t < end && o.status !== "cancelled";
    });
    return { date: day, revenue: Math.round(dayOrders.reduce((s, o) => s + o.total, 0) * 100) / 100, orders: dayOrders.length };
  });

  const statusCount: Record<string, number> = {};
  for (const o of orders) statusCount[o.status] = (statusCount[o.status] || 0) + 1;
  const colors: Record<string, string> = { pending: "#f59e0b", processing: "#0ea5e9", shipped: "#8b5cf6", delivered: "#10b981", cancelled: "#ef4444", returned: "#f97316" };
  const statusBreakdown = Object.entries(statusCount).map(([name, value]) => ({ name, value, color: colors[name] || "#94a3b8" }));

  const cutoff = now - 90 * 86400000;
  const prodRev: Record<string, { revenue: number; sold: number }> = {};
  for (const o of orders) {
    if (new Date(o.createdAt).getTime() < cutoff || o.status === "cancelled") continue;
    for (const it of o.items) {
      if (!prodRev[it.productId]) prodRev[it.productId] = { revenue: 0, sold: 0 };
      prodRev[it.productId].revenue += it.sellPrice * it.quantity;
      prodRev[it.productId].sold += it.quantity;
    }
  }
  const topProducts = Object.entries(prodRev)
    .map(([id, v]) => {
      const p = products.find((x) => x.id === id);
      return { id, title: p?.title || "Archived product", image: p?.image || "", sold: v.sold, revenue: Math.round(v.revenue * 100) / 100 };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const storePerformance = stores.map((s) => {
    const so = orders.filter((o) => o.storeId === s.id && o.status !== "cancelled");
    return { name: s.name, revenue: Math.round(so.reduce((sum, o) => sum + o.total, 0) * 100) / 100, orders: so.length };
  });

  const revenue = Math.round(rev(curOrders) * 100) / 100;
  const profit = Math.round(prof(curOrders) * 100) / 100;
  const activeProducts = products.filter((p) => p.status === "active").length;

  return NextResponse.json({
    revenue,
    revenueDelta: pct(revenue, Math.round(rev(prevOrders) * 100) / 100),
    orders: curOrders.length,
    ordersDelta: pct(curOrders.length, prevOrders.length),
    profit,
    profitDelta: pct(profit, Math.round(prof(prevOrders) * 100) / 100),
    products: activeProducts,
    productsDelta: pct(activeProducts, products.length - activeProducts),
    revenueSeries,
    statusBreakdown,
    topProducts,
    storePerformance,
    counts: {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalStores: stores.length,
      totalSuppliers: db.suppliers.filter((s) => s.userId === user.id).length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      lowStock: products.filter((p) => p.status !== "inactive" && p.quantity > 0 && p.quantity < 15).length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
    },
  });
}
