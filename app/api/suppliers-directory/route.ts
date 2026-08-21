import { NextResponse } from "next/server";
import { SUPPLIER_DIRECTORY, scoreSupplier } from "@/lib/supplier-directory";

export const dynamic = "force-dynamic";

// GET /api/suppliers-directory
// Params: q, category, region, sort (rating|price|shipping|products|bestmatch|name),
//         page (1-based), limit
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "";
  const region = searchParams.get("region") || "";
  const sort = searchParams.get("sort") || "bestmatch";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(24, Math.max(4, Number(searchParams.get("limit") || 8)));

  let items = SUPPLIER_DIRECTORY.map((s) => ({ ...s, score: scoreSupplier(s) }));

  if (q) {
    items = items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.bestFor.toLowerCase().includes(q) ||
        s.pros.some((p) => p.toLowerCase().includes(q))
    );
  }
  if (category) items = items.filter((s) => s.category === category);
  if (region) items = items.filter((s) => s.regions.some((r) => r.toLowerCase().includes(region.toLowerCase())));

  items.sort((a, b) => {
    switch (sort) {
      case "rating": return b.rating - a.rating;
      case "score": return b.score - a.score;
      case "shipping": return parseFirstDay(a.shippingDays) - parseFirstDay(b.shippingDays);
      case "products": return parseProducts(b.products) - parseProducts(a.products);
      case "price": {
        const ap = a.pricing.toLowerCase().startsWith("free") ? 0 : 1;
        const bp = b.pricing.toLowerCase().startsWith("free") ? 0 : 1;
        return ap - bp;
      }
      case "name": return a.name.localeCompare(b.name);
      case "newest": return b.founded - a.founded;
      case "bestmatch":
      default:
        return b.score - a.score;
    }
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const rows = items.slice(start, start + limit);

  return NextResponse.json({
    items: rows,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
    categories: [...new Set(SUPPLIER_DIRECTORY.map((s) => s.category))].sort(),
    regions: [...new Set(SUPPLIER_DIRECTORY.flatMap((s) => s.regions))].sort(),
  });
}

function parseFirstDay(s: string): number {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 99;
}
function parseProducts(s: string): number {
  const m = s.match(/([\d.]+)\s*([MKM]?)/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = (m[2] || "").toUpperCase();
  if (unit === "M") return n * 1_000_000;
  if (unit === "K") return n * 1_000;
  return n;
}
