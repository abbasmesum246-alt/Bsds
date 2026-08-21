import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { AFFILIATE_OFFERS } from "@/lib/affiliate/offers";
import { AFFILIATE_NETWORKS } from "@/lib/affiliate/networks";
import type { Strategy } from "@/lib/affiliate/types";
import { makeId } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ReqBody {
  niche?: string;
  platform?: string;
  audience?: string;
  goal?: string;
  offerId?: string;
}

const PLATFORM_TACTICS: Record<string, {
  contentFormat: string; hook: string; cta: string; schedule: string;
  ctr: number; conv: number; steps: string[];
}> = {
  youtube: {
    contentFormat: "8–12 min review or tutorial",
    hook: "Start with the result/pain, then show the product solving it in first 15s",
    cta: "Link in description + pinned comment + mention mid-video",
    schedule: "1 long-form video/week + 3 Shorts",
    ctr: 4.5, conv: 3.2,
    steps: [
      "Keyword research with TubeBuddy/VidIQ for high-intent terms",
      "Hook in first 15 seconds showing the result",
      "Honest review: pros, cons, who it's for",
      "Show the product on screen with callout",
      "Add 3 links: description, pinned comment, end screen",
    ],
  },
  tiktok: {
    contentFormat: "15–45s vertical trend video",
    hook: "Problem → solution → reveal in under 3 seconds",
    cta: "Link in bio (use Beacons/Linktree)",
    schedule: "1–3 videos/day, test 3 angles before scaling",
    ctr: 6.8, conv: 2.1,
    steps: [
      "Jump on a trending sound in first 48 hours",
      "Show the product in use, not unboxing",
      "Pattern interrupt every 2–3 seconds",
      "Caption with a question to boost comments",
      "Duplicate winning videos with different hooks",
    ],
  },
  instagram: {
    contentFormat: "Reels 15–30s + carousel posts + Stories",
    hook: "Visually striking first frame with bold text",
    cta: "Link in bio + 'LINK IN BIO' on screen + story swipe-up",
    schedule: "4–5 Reels/week, daily Stories, 2 carousels",
    ctr: 3.2, conv: 2.4,
    steps: [
      "Use trending audio within the first day",
      "3–5 posts per week minimum for reach",
      "Stories with poll/question stickers drive DMs",
      "Carousel posts save best (algorithm boost)",
      "Build email list via free lead magnet",
    ],
  },
  blog: {
    contentFormat: "Long-form review/best-of article (2000+ words)",
    hook: "SEO title with number + year + honest verdict",
    cta: "Multiple contextual buttons + comparison tables",
    schedule: "2–4 articles/week, update old posts monthly",
    ctr: 2.8, conv: 5.1,
    steps: [
      "Target long-tail 'best X for Y' keywords",
      "Build comparison table with affiliate links at top",
      "Actually use/test the product for credibility",
      "Add pros/cons and honest verdict",
      "Capture emails with lead magnet for recurring traffic",
    ],
  },
  email: {
    contentFormat: "3–5 email welcome sequence + weekly newsletter",
    hook: "Personal story → problem → single recommendation",
    cta: "Single clear button per email, above the fold",
    schedule: "Welcome sequence (automated) + 2 broadcasts/week",
    ctr: 8.5, conv: 6.2,
    steps: [
      "Lead magnet (free guide/checklist) to build list",
      "5-email welcome sequence with value + one offer",
      "Segment by interest (clicked what?)",
      "Send 80% value, 20% offers",
      "Use P.S. line — it often gets the most clicks",
    ],
  },
  twitter: {
    contentFormat: "Thread + single-value tweets",
    hook: "Counter-intuitive first tweet, thread builds case",
    cta: "Last tweet in thread has the link",
    schedule: "2–3 threads/week + 3–5 daily tweets",
    ctr: 2.1, conv: 1.8,
    steps: [
      "Build authority with how-to threads first",
      "Pin a thread with your best recommendation",
      "Reply to bigger accounts early for visibility",
      "Use a link-in-bio with multiple offers",
    ],
  },
  pinterest: {
    contentFormat: "Vertical pins (1000x1500) + Idea Pins",
    hook: "Bold text overlay on a clean image",
    cta: "Pin links directly to the offer (no bio needed)",
    schedule: "5–10 pins/day using Tailwind",
    ctr: 2.5, conv: 3.0,
    steps: [
      "Design 10 pins per post using Canva templates",
      "Use keyword-rich pin titles and descriptions",
      "Pin to relevant group boards",
      "Pinterest is a search engine — SEO matters more than trends",
    ],
  },
};

const NICHE_GUIDANCE: Record<string, { angles: string[]; avoid: string[] }> = {
  saas: {
    angles: ["'The tool that saves me X hours/week'", "Comparison vs competitors", "Step-by-step setup tutorial", "ROI breakdown"],
    avoid: ["Hard sell without proof", "Ignoring free trial objections"],
  },
  fashion: {
    angles: ["'Get the look for less'", "Styling video / lookbook", "Try-on haul", "Outfit for occasion X"],
    avoid: ["Oversized logos", "Poor lighting/fit"],
  },
  beauty: {
    angles: ["Honest review after 30 days", "Before/after results", "Drugstore vs high-end dupes", "Routine walkthrough"],
    avoid: ["Over-edited photos", "Making medical claims"],
  },
  finance: {
    angles: ["'How I saved $X' tutorial", "App comparison", "Step-by-step for beginners", "Side-h income report"],
    avoid: ["Get-rich-quick promises", "Ignoring fees/risks"],
  },
  fitness: {
    angles: ["30-day results", "Home vs gym equipment", "Beginner-friendly routine", "What I eat in a day"],
    avoid: ["Unrealistic transformations", "Medical advice"],
  },
  tech: {
    angles: ["Honest long-term review", "Top 5 under $X", "Setup tutorial", "Comparison video"],
    avoid: ["Spec sheet reads", "Not showing real use"],
  },
  education: {
    angles: ["What I learned", "Course vs free alternatives", "Career outcome story", "Beginner's roadmap"],
    avoid: ["Income claims without proof"],
  },
  default: {
    angles: ["Honest review", "'How I use it' demo", "Problem/solution story", "Comparison vs alternatives"],
    avoid: ["Fake urgency", "Not disclosing affiliate relationship"],
  },
};

export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as ReqBody;
  const platform = (body.platform || "youtube").toLowerCase();
  const niche = (body.niche || "general").toLowerCase();
  const goal = body.goal || "Maximize commissions";

  const tactics = PLATFORM_TACTICS[platform] || PLATFORM_TACTICS.youtube;
  const guidance = NICHE_GUIDANCE[niche] || NICHE_GUIDANCE.default;

  // Pick relevant offers based on niche
  const nicheMatch = AFFILIATE_OFFERS.filter((o) => {
    const blob = (o.category + o.tags.join(" ") + o.title).toLowerCase();
    return blob.includes(niche) || o.tags.some((t) => niche.includes(t) || t.includes(niche));
  });
  const recommended = (nicheMatch.length ? nicheMatch : AFFILIATE_OFFERS)
    .sort((a, b) => b.influencerFit + b.epc * 5 - (a.influencerFit + a.epc * 5))
    .slice(0, 3);

  const strategies: Strategy[] = recommended.map((offer) => {
    const network = AFFILIATE_NETWORKS.find((n) => n.id === offer.networkId);
    const angle = guidance.angles[Math.floor(Math.random() * guidance.angles.length)];
    return {
      id: makeId("strat"),
      title: `${offer.brand}: ${tactics.contentFormat}`,
      platform,
      offer: offer.title,
      angle,
      contentFormat: tactics.contentFormat,
      hook: tactics.hook,
      cta: tactics.cta,
      postingSchedule: tactics.schedule,
      expectedCtr: tactics.ctr,
      expectedConversion: tactics.conv,
      tips: [
        `Network: ${network?.name || "Direct"} · ${offer.commission}`,
        `Best angle for ${niche}: ${angle}`,
        offer.recurring ? "♻️ This pays RECURRING — promote it hard, it compounds." : "",
        `Expected EPC: $${offer.epc} · conversion ${offer.conversionRate}%`,
        ...guidance.avoid.map((a) => `⚠️ Avoid: ${a}`),
      ].filter(Boolean),
      steps: tactics.steps,
      niche,
    };
  });

  // Click-growth tactics
  const clickGrowth = [
    `Write a better hook — it's 80% of CTR. Test 3 different first 3 seconds/lines.`,
    `Post consistently for 30 days before judging. The algorithm rewards momentum.`,
    `Reply to every comment in first hour — signals boost reach.`,
    `Add a clear CTA twice: once at the hook (curiosity) and once at the end (action).`,
    `Repurpose: turn 1 YouTube video into 5 Shorts, 3 Reels, 1 thread, 1 carousel.`,
    `Study your top 3 competitors' best-performing content and model the structure.`,
    `Use native links where possible (TikTok Shop, YouTube Shopping) — they convert 2–3× higher.`,
    `Disclose affiliate relationship clearly — #ad or #affiliate builds trust and is legally required.`,
  ];

  return NextResponse.json({
    goal,
    platform,
    niche,
    summary: `For your ${niche} audience on ${platform}, focus on ${recommended.length} high-fit ${recommended[0]?.category.toLowerCase() || ""} offers. Expected CTR ~${tactics.ctr}% and conversion ~${tactics.conv}% with the format below.`,
    strategies,
    recommendedOffers: recommended.map((o) => ({
      id: o.id, title: o.title, brand: o.brand, commission: o.commission,
      epc: o.epc, conversionRate: o.conversionRate, trending: o.trending,
      image: o.image, influencerFit: o.influencerFit,
    })),
    clickGrowth,
  });
}
