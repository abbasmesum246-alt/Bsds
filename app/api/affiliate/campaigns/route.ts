import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { loadCampaigns, saveCampaigns } from "@/lib/affiliate/mode";
import type { Campaign } from "@/lib/affiliate/types";
import { makeId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") as "guest" | "account") || "guest";
  return NextResponse.json({ campaigns: loadCampaigns(mode) });
}

export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const { mode, campaign } = body as { mode: "guest" | "account"; campaign: Partial<Campaign> };
  if (mode !== "account") {
    return NextResponse.json({ error: "Switch to Account mode to create real campaigns." }, { status: 400 });
  }
  const all = loadCampaigns("account");
  const newCampaign: Campaign = {
    id: makeId("camp"),
    offerId: campaign.offerId || "",
    offerTitle: campaign.offerTitle || "",
    brand: campaign.brand || "",
    platform: campaign.platform || "instagram",
    status: campaign.status || "draft",
    link: campaign.link || `https://bsds.app/ref/${makeId("r")}`,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    spend: 0,
    startDate: new Date().toISOString(),
    notes: campaign.notes || "",
    contentIdea: campaign.contentIdea,
  };
  all.unshift(newCampaign);
  saveCampaigns(all);
  return NextResponse.json({ campaign: newCampaign });
}
