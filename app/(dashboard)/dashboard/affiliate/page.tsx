"use client";
import * as React from "react";
import Link from "next/link";
import {
  Megaphone, Users, MousePointerClick, DollarSign, TrendingUp,
  Sparkles, Search, Award, Target, Shield, Play, Zap, Star,
} from "lucide-react";
import { useAffiliateMode } from "@/components/affiliate/mode-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatCurrency } from "@/lib/utils";

interface Stats {
  totalClicks: number; totalConversions: number; totalRevenue: number;
  totalSpend: number; conversionRate: number; epc: number; roi: number;
  activeCampaigns: number; offersPromoted: number;
}

const AFFILIATE_TYPES = [
  { id: "creator", icon: "🎬", name: "Content Creators", desc: "YouTubers, TikTokers, streamers", fit: "Product reviews, tutorials, hauls" },
  { id: "influencer", icon: "✨", name: "Social Influencers", desc: "Instagram, Pinterest, lifestyle", fit: "Fashion, beauty, lifestyle brands" },
  { id: "blogger", icon: "✍️", name: "Bloggers / SEO", desc: "Review & comparison sites", fit: "Best-of lists, tutorials, long-tail SEO" },
  { id: "email", icon: "📧", name: "Email Marketers", desc: "Newsletter & list owners", fit: "Recurring SaaS, high-ticket offers" },
  { id: "paid", icon: "💰", name: "Paid Media Buyers", desc: "Facebook/Google/YouTube ads", fit: "High-EPC CPA offers, funnels" },
  { id: "saas", icon: "⚙️", name: "SaaS / B2B", desc: "Reviewers & consultants", fit: "Recurring commissions, high LTV" },
  { id: "deal", icon: "🏷️", name: "Deal/Coupon Sites", desc: "Discount communities", fit: "Fashion, hosting, subscription boxes" },
  { id: "niche", icon: "🎯", name: "Niche Communities", desc: "Reddit, Discord, forums", fit: "Specialized products the community trusts" },
];

export default function AffiliateHub() {
  const { mode, setMode } = useAffiliateMode();
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/affiliate/analytics?mode=${mode}`)
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [mode]);

  const isGuest = mode === "guest";

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Affiliate Hub"
        description="Discover offers, build campaigns, track earnings, and grow with AI strategy."
        icon={<Megaphone className="h-5 w-5" />}
        action={<Link href="/dashboard/offers" className="btn-premium"><Sparkles className="h-4 w-4" />Browse Offers</Link>}
      />

      {/* Mode toggle */}
      <Card className="overflow-hidden border-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <button
            onClick={() => setMode("guest")}
            className={`p-5 text-left transition-all ${isGuest ? "bg-[linear-gradient(135deg,rgba(37,71,247,0.08),rgba(124,58,237,0.08))] ring-2 ring-violet-400" : "hover:bg-ink-50"}`}
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Play className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold">Guest / Demo</p>
                  {isGuest && <Badge tone="green">Active</Badge>}
                </div>
                <p className="text-xs text-ink-500">Practice with virtual data. No real connections or money.</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setMode("account")}
            className={`p-5 text-left transition-all ${!isGuest ? "bg-[linear-gradient(135deg,rgba(37,71,247,0.08),rgba(124,58,237,0.08))] ring-2 ring-violet-400" : "hover:bg-ink-50"}`}
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Shield className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold">Account / Professional</p>
                  {!isGuest && <Badge tone="green">Active</Badge>}
                </div>
                <p className="text-xs text-ink-500">Real connections, real tracking, real earnings.</p>
              </div>
            </div>
          </button>
        </div>
        {isGuest && (
          <div className="bg-amber-50 border-t border-amber-100 px-5 py-2.5 text-xs text-amber-800 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5" /> You're in DEMO mode — campaigns and numbers are virtual for learning. Switch to Account when you're ready to earn.
          </div>
        )}
      </Card>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi icon={<MousePointerClick className="h-5 w-5" />} label="Total Clicks" value={stats.totalClicks.toLocaleString()} tone="#4f46e5" />
          <Kpi icon={<Users className="h-5 w-5" />} label="Conversions" value={stats.totalConversions.toLocaleString()} sub={`${stats.conversionRate}% CR`} tone="#10b981" />
          <Kpi icon={<DollarSign className="h-5 w-5" />} label="Commission" value={formatCurrency(stats.totalRevenue)} sub={`$${stats.epc} EPC`} tone="#0d9488" />
          <Kpi icon={<TrendingUp className="h-5 w-5" />} label="ROI" value={`${stats.roi > 0 ? "+" : ""}${stats.roi}%`} sub={`${stats.activeCampaigns} active`} tone={stats.roi >= 0 ? "#10b981" : "#ef4444"} />
        </div>
      ) : null}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard href="/dashboard/offers" icon={<Search className="h-5 w-5" />} title="Find Offers" desc="Browse 30+ real programs with live rates" color="from-blue-500 to-indigo-600" />
        <ActionCard href="/dashboard/networks" icon={<Award className="h-5 w-5" />} title="Networks" desc="Compare affiliate networks" color="from-purple-500 to-pink-600" />
        <ActionCard href="/dashboard/strategy" icon={<Target className="h-5 w-5" />} title="AI Strategy" desc="Get a content plan for any niche" color="from-emerald-500 to-teal-600" />
        <ActionCard href="/dashboard/campaigns" icon={<Star className="h-5 w-5" />} title="Campaigns" desc="Track clicks & earnings" color="from-amber-500 to-orange-600" />
      </div>

      {/* Affiliate types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-violet-600" />Which type of affiliate are you?</CardTitle>
          <CardDescription>Every feature is grouped by how you promote. Tap a type to see tailored advice.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {AFFILIATE_TYPES.map((t) => (
              <div key={t.id} className="rounded-xl border border-ink-100 p-4 hover:border-brand-300 hover:shadow-sm transition cursor-pointer group">
                <div className="text-3xl mb-2">{t.icon}</div>
                <p className="font-semibold text-sm group-hover:text-brand-700">{t.name}</p>
                <p className="text-xs text-ink-500 mt-0.5">{t.desc}</p>
                <p className="text-[11px] text-brand-700 mt-2 bg-brand-50 rounded px-2 py-1 inline-block">{t.fit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI promo */}
      <Card className="overflow-hidden border-0 text-white" >
        <div className="p-6 bg-[linear-gradient(135deg,#4f46e5,#0d9488)] relative">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><Sparkles className="h-7 w-7" /></div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Ask BSDS AI anything</h3>
              <p className="text-sm text-white/80 mt-1">"What are the best recurring affiliate programs for a YouTuber?" · "How do I get more clicks?" · It has web access for real-time data.</p>
            </div>
            <Button className="bg-white text-brand-700 hover:bg-white/90 shrink-0">Ask AI →</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Kpi({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub?: string; tone: string }) {
  return (
    <div className="card-solid p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-extrabold mt-1.5">{value}</p>
          {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
        </div>
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tone}15`, color: tone }}>{icon}</div>
      </div>
    </div>
  );
}

function ActionCard({ href, icon, title, desc, color }: { href: string; icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <Link href={href}>
      <Card className="p-5 hover:shadow-soft transition cursor-pointer group h-full">
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center mb-3 group-hover:scale-105 transition`}>{icon}</div>
        <p className="font-bold">{title}</p>
        <p className="text-xs text-ink-500 mt-0.5">{desc}</p>
      </Card>
    </Link>
  );
}
