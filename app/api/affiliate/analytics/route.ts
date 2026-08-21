import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { loadCampaigns, virtualClickSeries } from "@/lib/affiliate/mode";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") as "guest" | "account") || "guest";
  const campaigns = loadCampaigns(mode);
  const clicksByDay = virtualClickSeries(14);

  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const conversionRate = totalClicks ? (totalConversions / totalClicks) * 100 : 0;
  const epc = totalClicks ? totalRevenue / totalClicks : 0;
  const roi = totalSpend ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

  const platformMap: Record<string, { clicks: number; revenue: number; conv: number }> = {};
  for (const c of campaigns) {
    if (!platformMap[c.platform]) platformMap[c.platform] = { clicks: 0, revenue: 0, conv: 0 };
    platformMap[c.platform].clicks += c.clicks;
    platformMap[c.platform].revenue += c.revenue;
    platformMap[c.platform].conv += c.conversions;
  }
  const topPlatforms = Object.entries(platformMap)
    .map(([platform, v]) => ({ platform, ...v }))
    .sort((a, b) => b.revenue - a.revenue);

  const topOffers = campaigns
    .map((c) => ({ offerId: c.offerId, offerTitle: c.offerTitle, brand: c.brand, clicks: c.clicks, conversions: c.conversions, revenue: c.revenue, epc: c.clicks ? c.revenue / c.clicks : 0 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return NextResponse.json({
    totalClicks, totalConversions, totalRevenue, totalSpend,
    conversionRate: Math.round(conversionRate * 100) / 100,
    epc: Math.round(epc * 100) / 100,
    roi: Math.round(roi * 10) / 10,
    activeCampaigns: campaigns.filter((c) => c.status === "active").length,
    offersPromoted: new Set(campaigns.map((c) => c.offerId)).size,
    clicksByDay, topPlatforms, topOffers,
  });
}
