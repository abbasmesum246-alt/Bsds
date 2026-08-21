import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { AFFILIATE_NETWORKS, scoreNetwork } from "@/lib/affiliate/networks";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "best";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(24, Number(searchParams.get("limit") || 12));

  let items = AFFILIATE_NETWORKS.map((n) => ({ ...n, score: scoreNetwork(n) }));
  if (q) items = items.filter((n) => [n.name, n.category, n.bestFor, ...n.pros].join(" ").toLowerCase().includes(q));
  if (category) items = items.filter((n) => n.category === category);

  items.sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "merchants") return b.merchants - a.merchants;
    if (sort === "easiest") return a.approvalDifficulty === "easy" ? -1 : 1;
    return b.score - a.score;
  });

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json({
    items: items.slice((page - 1) * limit, page * limit),
    total, page, totalPages, hasMore: page < totalPages,
    categories: [...new Set(AFFILIATE_NETWORKS.map((n) => n.category))].sort(),
  });
}
