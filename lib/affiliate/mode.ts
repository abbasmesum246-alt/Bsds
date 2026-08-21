import { AFFILIATE_OFFERS } from "./offers";
import type { Campaign, AffiliateMode, ClickByDay } from "./types";

const CAMPAIGN_KEY = "bsds_affiliate_campaigns";
const MODE_KEY = "bsds_affiliate_mode";

export function getMode(): AffiliateMode {
  if (typeof window === "undefined") return "guest";
  return (localStorage.getItem(MODE_KEY) as AffiliateMode) || "guest";
}
export function setMode(mode: AffiliateMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_KEY, mode);
}

// Guest mode always uses virtual demo data; account mode uses user-created campaigns.
export function loadCampaigns(mode: AffiliateMode): Campaign[] {
  if (mode === "account") {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(CAMPAIGN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
  return generateVirtualCampaigns();
}

export function saveCampaigns(campaigns: Campaign[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaigns));
}

// Deterministic pseudo-random so the demo feels stable across reloads.
function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function generateVirtualCampaigns(): Campaign[] {
  const rng = seeded(42);
  const platforms: Campaign["platform"][] = ["instagram", "youtube", "tiktok", "blog", "email"];
  const picked = [...AFFILIATE_OFFERS].sort(() => rng() - 0.5).slice(0, 9);
  const now = Date.now();
  return picked.map((offer, i) => {
    const clicks = Math.floor(200 + rng() * 8000);
    const conv = clicks * (0.008 + rng() * 0.06);
    const conversions = Math.max(0, Math.round(conv));
    const aov = offer.commissionType === "percent" ? 60 : offer.commissionValue;
    const revenue = Math.round(conversions * aov * 100) / 100;
    const spend = Math.round(clicks * (0.05 + rng() * 0.4) * 100) / 100;
    const start = new Date(now - (30 - i * 2) * 86400000).toISOString();
    return {
      id: `vc_${i}_${offer.id}`,
      offerId: offer.id,
      offerTitle: offer.title,
      brand: offer.brand,
      platform: platforms[i % platforms.length],
      status: i % 4 === 0 ? "paused" : "active",
      link: `https://demo.bsds.app/ref/${offer.brand.toLowerCase().replace(/\s+/g, "")}?ref=demo`,
      clicks,
      conversions,
      revenue,
      spend,
      startDate: start,
      notes: "Virtual campaign for practice. No real traffic or money.",
      contentIdea: [
        "Honest review video comparing 3 options",
        "Top 10 list post with comparison table",
        'Day-in-the-life TikTok "what I use"',
        "Reel showing the product in action",
        "Email sequence to existing subscribers",
      ][i % 5],
    };
  });
}

export function virtualClickSeries(days = 14): ClickByDay[] {
  const rng = seeded(7);
  const out: ClickByDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const base = 180 + Math.sin(i / 3) * 60 + rng() * 120;
    const clicks = Math.max(40, Math.round(base));
    const conversions = Math.round(clicks * (0.025 + rng() * 0.03));
    const revenue = Math.round(conversions * (15 + rng() * 40) * 100) / 100;
    out.push({ date: d.toISOString().slice(0, 10), clicks, conversions, revenue });
  }
  return out;
}
