import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { makeId } from "@/lib/utils";
import type { Campaign } from "@/lib/affiliate/types";

export const dynamic = "force-dynamic";

interface CampaignRow {
  id: string; offer_id: string; offer_title: string; brand: string;
  platform: string; status: string; link: string; clicks: number;
  conversions: number; revenue: number; spend: number;
  start_date: string; notes: string; content_idea: string | null;
}

function rowToCampaign(r: CampaignRow): Campaign {
  return {
    id: r.id, offerId: r.offer_id || "", offerTitle: r.offer_title,
    brand: r.brand, platform: r.platform as Campaign["platform"],
    status: r.status as Campaign["status"], link: r.link,
    clicks: r.clicks, conversions: r.conversions, revenue: r.revenue,
    spend: r.spend, startDate: r.start_date, notes: r.notes,
    contentIdea: r.content_idea || undefined,
  };
}

const DEMO_CAMPAIGNS: Campaign[] = (() => {
  // Inline seed so guest mode always has practice data without importing.
  const offers = ["Shopify", "Canva Pro", "NordVPN", "SHEIN", "Semrush", "Gymshark", "Notion", "Epidemic Sound", "Wise"];
  const platforms: Campaign["platform"][] = ["instagram", "youtube", "tiktok", "blog", "email"];
  const rng = (n: number) => { let s = n * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
  const r = rng(42);
  return offers.slice(0, 9).map((brand, i) => {
    const clicks = Math.floor(200 + r() * 8000);
    const conversions = Math.round(clicks * (0.008 + r() * 0.06));
    const revenue = Math.round(conversions * 40 * 100) / 100;
    return {
      id: `vc_${i}`, offerId: `o_${i}`, offerTitle: `${brand} — top deal`, brand,
      platform: platforms[i % platforms.length], status: i % 4 === 0 ? "paused" : "active",
      link: `https://demo.bsds.app/ref/${brand.toLowerCase()}?ref=demo`,
      clicks, conversions, revenue, spend: Math.round(clicks * 0.2 * 100) / 100,
      startDate: new Date(Date.now() - (30 - i * 2) * 86400000).toISOString(),
      notes: "Virtual campaign for practice.",
      contentIdea: ["Honest review", "Top 10 list", "Day-in-the-life", "Product in action", "Email sequence"][i % 5],
    };
  });
})();

export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "guest";
  if (mode === "guest") return NextResponse.json({ campaigns: DEMO_CAMPAIGNS });

  const rows = db.prepare("SELECT * FROM campaigns WHERE user_id = ? ORDER BY start_date DESC").all(auth.user.id) as CampaignRow[];
  return NextResponse.json({ campaigns: rows.map(rowToCampaign) });
}

export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const { mode, campaign } = body as { mode: string; campaign: Partial<Campaign> };
  if (mode !== "account") return NextResponse.json({ error: "Switch to Account mode." }, { status: 400 });

  const id = makeId("camp");
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO campaigns (id, user_id, offer_id, offer_title, brand, platform, status, link, clicks, conversions, revenue, spend, start_date, notes, content_idea)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?, ?, ?)`
  ).run(
    id, auth.user.id, campaign.offerId || "", campaign.offerTitle || "", campaign.brand || "",
    campaign.platform || "instagram", campaign.status || "draft", campaign.link || "",
    now, campaign.notes || "", campaign.contentIdea || null
  );
  const row = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id) as CampaignRow;
  return NextResponse.json({ campaign: rowToCampaign(row) });
}
