import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { AFFILIATE_OFFERS } from "@/lib/affiliate/offers";
import { AFFILIATE_NETWORKS } from "@/lib/affiliate/networks";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";
  const sort = searchParams.get("sort") || "trending";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(24, Math.max(6, Number(searchParams.get("limit") || 12)));
  const recurringOnly = searchParams.get("recurring") === "true";

  let items = AFFILIATE_OFFERS.map((o) => {
    const net = AFFILIATE_NETWORKS.find((n) => n.id === o.networkId);
    return { ...o, networkName: net?.name || "—", networkRating: net?.rating || 0 };
  });

  if (q) items = items.filter((o) =>
    [o.title, o.brand, o.description, o.tags.join(" ")].some((f) => f.toLowerCase().includes(q))
  );
  if (category) items = items.filter((o) => o.category.toLowerCase().includes(category.toLowerCase()));
  if (tag) items = items.filter((o) => o.tags.includes(tag));
  if (recurringOnly) items = items.filter((o) => o.recurring);

  items.sort((a, b) => {
    switch (sort) {
      case "commission": return b.commissionValue - a.commissionValue;
      case "epc": return b.epc - a.epc;
      case "conversion": return b.conversionRate - a.conversionRate;
      case "gravity": return b.gravity - a.gravity;
      case "fit": return b.influencerFit - a.influencerFit;
      case "trending":
      default:
        return (b.trendingPct * (b.trending === "up" ? 2 : b.trending === "stable" ? 1 : 0)) -
               (a.trendingPct * (a.trending === "up" ? 2 : a.trending === "stable" ? 1 : 0));
    }
  });

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const rows = items.slice((page - 1) * limit, page * limit);

  // Build a light strategy summary per offer
  const withTips = rows.map((o) => ({
    ...o,
    strategyTip: buildTip(o),
  }));

  return NextResponse.json({
    items: withTips,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
    categories: [...new Set(AFFILIATE_OFFERS.map((o) => o.category))].sort(),
    tags: [...new Set(AFFILIATE_OFFERS.flatMap((o) => o.tags))].sort(),
  });
}

function buildTip(o: typeof AFFILIATE_OFFERS[number]): string {
  if (o.tags.includes("recurring")) return "Promote as 'tool I use daily' — recurring SaaS stacks monthly income.";
  if (o.category.includes("Fashion") || o.tags.includes("tiktok")) return "Show a 15-second 'get the look' reel with the link in bio.";
  if (o.category.includes("Beauty")) return "Demonstrate results over time. Trust + before/after drives conversions.";
  if (o.category.includes("Finance")) return "Educate first: compare to alternatives and explain fees clearly.";
  if (o.epc > 20) return "High EPC — strong creative + paid ads can scale this quickly.";
  if (o.conversionRate > 8) return "Converts very well — simple recommendation content works best.";
  return "Build genuine review/tutorial content; place the link where viewers decide.";
}
