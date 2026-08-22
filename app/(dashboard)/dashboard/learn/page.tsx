"use client";
import * as React from "react";
import Link from "next/link";
import {
  GraduationCap, BookOpen, TrendingUp, AlertTriangle, CheckCircle2,
  ChevronRight, Play, Trophy, Target, DollarSign, MousePointerClick,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

interface Category {
  id: string; name: string; emoji: string; definition: string; howItWorks: string;
  commissionRange: string; realisticEarnings: string;
  bestPlatforms: { name: string; why: string }[];
  strategies: { title: string; steps: string[] }[]; roadmap: string[];
  pros: string[]; cons: string[]; skillsNeeded: string[]; contentFormats: string[]; pitfalls: string[];
}

const FOUNDATION = [
  { icon: "💡", title: "What is affiliate marketing?", text: "You recommend someone else's product using a special link. When someone buys through your link, you earn a commission. You don't need to create, store, or ship anything." },
  { icon: "🔗", title: "How affiliate links work", text: "Each link has your unique ID. When clicked, a 'cookie' is saved on the visitor's device. If they buy within the cookie window (24 hours to 90 days), you get credit for the sale." },
  { icon: "🍪", title: "Cookie length matters", text: "Amazon gives only 24 hours. Many SaaS programs give 60–90 days. Longer cookies = more chances to earn. Always check before joining." },
  { icon: "💰", title: "Commission types", text: "CPS = % of sale. CPA = flat fee per action. CPL = pay per lead. Recurring = you earn every month the customer stays. Recurring is the holy grail." },
  { icon: "📊", title: "Key numbers to know", text: "EPC = earnings per click. CR = conversion rate (%). AOV = average order value. ROI = return on investment. Track these every week." },
  { icon: "⚖️", title: "Disclosure is the law", text: "The FTC (US) and similar bodies worldwide require you to clearly say you may earn from links. Use #ad or 'affiliate link'. Hiding it can get you fined." },
];

const GLOSSARY = [
  ["Affiliate", "You — the person promoting products for commission"],
  ["Merchant / Advertiser", "The company that owns the product and pays commission"],
  ["Affiliate Network", "Middleman platform (Impact, Awin, CJ) connecting you to many brands"],
  ["Affiliate Link", "Your unique tracking URL"],
  ["Cookie", "Small file that remembers who referred a visitor"],
  ["EPC", "Earnings Per Click — average earned per click (higher = better)"],
  ["CR / Conversion Rate", "% of clicks that turn into a sale"],
  ["AOV", "Average Order Value — average amount spent per order"],
  ["CPA", "Cost Per Action — flat fee when someone takes an action (sign up, etc.)"],
  ["CPS", "Cost Per Sale — percentage of each sale"],
  ["Recurring commission", "Earn every month a customer stays subscribed"],
  ["Landing page", "A single web page built to convert one offer"],
  ["CTR", "Click-Through Rate — % of people who click your link"],
  ["ROI / ROAS", "Return on investment / ad spend"],
  ["Chargeback", "When a sale is reversed and commission is taken back"],
  ["Pixel / Postback", "Code that tracks conversions back to your ads"],
  ["Whitelabel", "Rebranding a product as your own"],
  ["Niche", "A focused topic/audience you serve"],
];

export default function LearnPage() {
  const [categories, setCategories] = React.useState<Category[] | null>(null);
  const [active, setActive] = React.useState<Category | null>(null);

  React.useEffect(() => {
    fetch("/api/affiliate/categories").then((r) => r.json()).then((d) => {
      setCategories(d.categories);
      setActive(d.categories[0]);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Affiliate Academy"
        description="The complete guide built into BSDS. Start here if you're new — no external tutorials needed."
        icon={<GraduationCap className="h-5 w-5" />}
      />

      {/* Quick start path */}
      <Card className="border-0 text-white overflow-hidden" >
        <div className="p-6 bg-[linear-gradient(135deg,#4f46e5,#0d9488)] relative">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
          <h2 className="text-xl font-extrabold flex items-center gap-2 relative"><Play className="h-5 w-5" />Your 30-day quick-start path</h2>
          <p className="text-sm text-white/80 mt-1 max-w-2xl relative">Follow these steps in order. By day 30 you'll have a real affiliate system running.</p>
          <div className="mt-5 grid sm:grid-cols-5 gap-2 relative">
            {[
              { d: "Day 1–3", t: "Pick 1 niche", to: "/dashboard/offers" },
              { d: "Day 4–7", t: "Join 3 networks", to: "/dashboard/networks" },
              { d: "Week 2", t: "Create content", to: "/dashboard/strategy" },
              { d: "Week 3", t: "Track & optimize", to: "/dashboard/campaigns" },
              { d: "Week 4", t: "Scale winners", to: "/dashboard/affiliate" },
            ].map((s, i) => (
              <Link key={i} href={s.to} className="rounded-xl bg-white/15 hover:bg-white/25 transition p-3 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">{s.d}</p>
                <p className="text-sm font-semibold mt-0.5 flex items-center gap-1">{s.t}<ChevronRight className="h-3.5 w-3.5" /></p>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* Foundation cards */}
      <div>
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand-600" />Understand the basics</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FOUNDATION.map((f, i) => (
            <Card key={i} className="hover:shadow-soft transition">
              <CardContent className="p-4">
                <div className="text-2xl mb-1.5">{f.icon}</div>
                <p className="font-bold text-sm">{f.title}</p>
                <p className="text-xs text-ink-600 mt-1 leading-relaxed">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories explorer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" />Which type of affiliate are you?</CardTitle>
          <CardDescription>Tap a type below to see its complete roadmap, strategies, earnings, pros and cons.</CardDescription>
        </CardHeader>
        <CardContent>
          {!categories || !active ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="grid lg:grid-cols-[280px_1fr] gap-5">
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <button key={c.id} onClick={() => setActive(c)}
                    className={cn("w-full text-left p-3 rounded-xl flex items-center gap-3 transition border",
                      active.id === c.id ? "bg-[linear-gradient(135deg,rgba(37,71,247,0.08),rgba(124,58,237,0.08))] border-brand-300 ring-1 ring-brand-200" : "border-ink-100 hover:bg-ink-50")}>
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-tight">{c.name}</p>
                      <p className="text-[11px] text-ink-500 truncate">{c.commissionRange}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2"><span className="text-2xl">{active.emoji}</span>{active.name}</h3>
                  <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">{active.definition}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge tone="brand">Commission: {active.commissionRange}</Badge>
                    <Badge tone="green">{active.realisticEarnings}</Badge>
                  </div>
                </div>

                <div className="rounded-xl bg-ink-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-1">How it works</p>
                  <p className="text-sm text-ink-700">{active.howItWorks}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-bold mb-2 flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="h-4 w-4" />Pros</p>
                    <ul className="space-y-1.5">{active.pros.map((p, i) => <li key={i} className="text-xs text-ink-700 flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />{p}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-2 flex items-center gap-1.5 text-red-700"><AlertTriangle className="h-4 w-4" />Cons</p>
                    <ul className="space-y-1.5">{active.cons.map((c, i) => <li key={i} className="text-xs text-ink-700 flex gap-2"><AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />{c}</li>)}</ul>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold mb-2 flex items-center gap-1.5"><Target className="h-4 w-4 text-brand-600" />Roadmap</p>
                  <ol className="space-y-2">{active.roadmap.map((r, i) => (
                    <li key={i} className="flex gap-3 text-xs">
                      <span className="h-5 w-5 shrink-0 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-ink-700 pt-0.5">{r}</span>
                    </li>
                  ))}</ol>
                </div>

                <div>
                  <p className="text-sm font-bold mb-2">Top strategies</p>
                  <div className="space-y-3">
                    {active.strategies.map((s, i) => (
                      <div key={i} className="rounded-xl border border-ink-100 p-3">
                        <p className="font-semibold text-sm">{s.title}</p>
                        <ol className="mt-2 space-y-1">{s.steps.map((step, j) => (
                          <li key={j} className="text-xs text-ink-600 flex gap-2">
                            <span className="h-4 w-4 shrink-0 rounded bg-ink-100 text-[9px] font-bold flex items-center justify-center mt-0.5">{j + 1}</span>{step}
                          </li>
                        ))}</ol>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">Best platforms</p>
                    <div className="space-y-1.5">{active.bestPlatforms.map((b, i) => (
                      <div key={i} className="text-xs bg-ink-50 rounded-lg p-2"><strong>{b.name}:</strong> <span className="text-ink-600">{b.why}</span></div>
                    ))}</div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">Content formats</p>
                    <div className="flex flex-wrap gap-1.5">{active.contentFormats.map((f) => <Badge key={f} tone="gray">{f}</Badge>)}</div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mt-3 mb-2">Skills needed</p>
                    <div className="flex flex-wrap gap-1.5">{active.skillsNeeded.map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-brand-50 text-brand-700">{s}</span>)}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                  <p className="text-xs font-bold text-red-800 mb-1.5 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" />Common pitfalls to avoid</p>
                  <ul className="space-y-1">{active.pitfalls.map((p, i) => <li key={i} className="text-xs text-red-900 flex gap-2"><span>•</span>{p}</li>)}</ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Glossary */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand-600" />Glossary</CardTitle>
          <CardDescription>Every term you'll see in affiliate dashboards, explained in plain words.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {GLOSSARY.map(([term, def]) => (
              <div key={term} className="rounded-lg border border-ink-100 p-2.5">
                <p className="text-xs font-bold text-ink-900">{term}</p>
                <p className="text-[11px] text-ink-500 mt-0.5">{def}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics explainer */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-600" />The numbers that matter</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Metric label="EPC (Earnings Per Click)" formula="Total commission ÷ total clicks" good="Above $1 is good; above $3 is excellent" />
            <Metric label="Conversion Rate" formula="Conversions ÷ clicks × 100" good="1-3% normal; 5%+ is great" />
            <Metric label="Gravity / Popularity" formula="How many affiliates sold it recently" good="Higher = proven, but more competition" />
            <Metric label="ROI" formula="(Revenue − cost) ÷ cost × 100" good="Always stay above 100% on paid ads" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-5 w-5 text-amber-600" />How to actually earn</CardTitle></CardHeader>
          <CardContent className="space-y-2.5 text-sm text-ink-700">
            <p><strong>1. Pick a niche you know.</strong> Passion or expertise keeps you consistent.</p>
            <p><strong>2. Build an audience first.</strong> Trust, not traffic, earns commission.</p>
            <p><strong>3. Recommend what you use.</strong> Honesty converts better than hype.</p>
            <p><strong>4. Track everything.</strong> What gets measured, gets improved.</p>
            <p><strong>5. Be patient.</strong> Most affiliates earn $0 for 6 months then it compounds.</p>
            <Link href="/dashboard/offers" className="inline-flex items-center gap-1 text-brand-600 font-semibold text-sm mt-2 hover:underline">Browse real offers now <ChevronRight className="h-4 w-4" /></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, formula, good }: { label: string; formula: string; good: string }) {
  return (
    <div>
      <p className="font-semibold text-ink-900 text-sm">{label}</p>
      <p className="text-xs text-ink-500 mt-0.5"><code className="bg-ink-100 px-1 rounded">{formula}</code></p>
      <p className="text-xs text-emerald-700 mt-0.5">✓ {good}</p>
    </div>
  );
}
