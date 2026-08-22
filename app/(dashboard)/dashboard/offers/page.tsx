"use client";
import * as React from "react";
import {
  Search, TrendingUp, TrendingDown, Minus, Star, Repeat, ExternalLink,
  Zap, MousePointerClick, Sparkles, Filter, Loader2, Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { useAffiliateMode } from "@/components/affiliate/mode-context";
import { cn, formatCurrency } from "@/lib/utils";

interface Offer {
  id: string; title: string; brand: string; description: string; category: string;
  commission: string; commissionValue: number; commissionType: string;
  epc: number; conversionRate: number; cookieLength: string; payout: string;
  url: string; trending: "up" | "down" | "stable"; trendingPct: number;
  gravity: number; regions: string[]; tags: string[]; influencerFit: number;
  recurring: boolean; image: string; networkName: string; strategyTip: string;
}

export default function OffersPage() {
  const { mode } = useAffiliateMode();
  const [items, setItems] = React.useState<Offer[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [sort, setSort] = React.useState("trending");
  const [recurring, setRecurring] = React.useState(false);
  const [facets, setFacets] = React.useState<{ categories: string[]; tags: string[] }>({ categories: [], tags: [] });
  const [selected, setSelected] = React.useState<Offer | null>(null);
  const sentinel = React.useRef<HTMLDivElement>(null);

  const load = React.useCallback(async (reset = false) => {
    if (reset) { setLoading(true); setPage(1); setItems([]); setHasMore(true); }
    else setLoadingMore(true);
    const params = new URLSearchParams({ q, category, tag, sort, recurring: String(recurring), mode, page: String(reset ? 1 : page), limit: "12" });
    const res = await fetch(`/api/affiliate/offers?${params}`);
    const data = await res.json();
    setFacets({ categories: data.categories, tags: data.tags });
    setItems((prev) => reset ? data.items : [...prev, ...data.items]);
    setHasMore(data.hasMore);
    setPage((p) => (reset ? 2 : p + 1));
    setLoading(false); setLoadingMore(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, tag, sort, recurring, mode]);

  React.useEffect(() => { const t = setTimeout(() => load(true), 250); return () => clearTimeout(t); }, [load]);

  React.useEffect(() => {
    if (!sentinel.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) load(false);
    }, { rootMargin: "300px" });
    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, load]);

  return (
    <div className="space-y-5 animate-in">
      <PageHeader title="Offer Marketplace" description="Real affiliate programs with live commission rates. Filter by niche, sort by earnings." icon={<Award className="h-5 w-5" />} />

      <Card className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search offers, brands, categories…" className="pl-9" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium focus:border-brand-400 focus:ring-4 focus:ring-violet-100 outline-none cursor-pointer">
            <option value="trending">🔥 Trending now</option>
            <option value="commission">💰 Highest commission</option>
            <option value="epc">💵 Best EPC</option>
            <option value="conversion">🎯 Highest conversion</option>
            <option value="fit">⭐ Best influencer fit</option>
            <option value="gravity">📈 Most popular</option>
          </select>
          <Button variant="secondary" size="icon" onClick={() => setRecurring((v) => !v)} aria-label="Recurring only" className={cn(recurring && "bg-brand-50 text-brand-700")}>
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        {(facets.categories.length > 0 || facets.tags.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button onClick={() => setCategory("")} className={cn("text-xs px-2.5 py-1 rounded-full font-medium", !category ? "bg-violet-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200")}>All</button>
            {facets.categories.slice(0, 8).map((c) => (
              <button key={c} onClick={() => setCategory(category === c ? "" : c)} className={cn("text-xs px-2.5 py-1 rounded-full font-medium truncate max-w-[160px]", category === c ? "bg-violet-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200")}>{c}</button>
            ))}
          </div>
        )}
      </Card>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}</div>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<Search className="h-7 w-7" />} title="No offers match" description="Try a different search or clear filters." action={<Button onClick={() => { setQ(""); setCategory(""); setTag(""); }}>Clear filters</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((o) => <OfferCard key={o.id} o={o} onOpen={() => setSelected(o)} />)}
        </div>
      )}

      <div ref={sentinel} className="flex justify-center py-6">
        {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-brand-500" />}
        {!hasMore && items.length > 0 && <p className="text-sm text-ink-400">You've seen all {items.length} offers</p>}
      </div>

      {selected && <OfferDetail o={selected} onClose={() => setSelected(null)} isGuest={mode === "guest"} />}
    </div>
  );
}

function OfferCard({ o, onOpen }: { o: Offer; onOpen: () => void }) {
  return (
    <Card className="overflow-hidden hover:shadow-soft transition group cursor-pointer flex flex-col" onClick={onOpen}>
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-[linear-gradient(135deg,rgba(37,71,247,0.1),rgba(124,58,237,0.1))] flex items-center justify-center text-2xl shrink-0">{o.image}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{o.networkName}</p>
            <h3 className="font-bold text-sm leading-tight line-clamp-2">{o.title}</h3>
          </div>
          {o.recurring && <Badge tone="green" className="shrink-0"><Repeat className="h-3 w-3" />Recur</Badge>}
        </div>
        <p className="text-xs text-ink-500 mt-2 line-clamp-2">{o.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {o.tags.slice(0, 3).map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-600">#{t}</span>)}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <Metric icon={<Zap className="h-3 w-3" />} label="Commission" value={o.commissionType === "percent" ? `${o.commissionValue}%` : formatCurrency(o.commissionValue)} />
          <Metric icon={<MousePointerClick className="h-3 w-3" />} label="EPC" value={`$${o.epc}`} />
          <Metric icon={<Star className="h-3 w-3" />} label="Conv." value={`${o.conversionRate}%`} />
        </div>
      </div>
      <div className="border-t border-ink-100 px-5 py-2.5 flex items-center justify-between bg-ink-50/60">
        <div className="flex items-center gap-1.5 text-xs">
          {o.trending === "up" ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> : o.trending === "down" ? <TrendingDown className="h-3.5 w-3.5 text-red-500" /> : <Minus className="h-3.5 w-3.5 text-ink-400" />}
          <span className={o.trending === "up" ? "text-emerald-600 font-semibold" : o.trending === "down" ? "text-red-600 font-semibold" : "text-ink-500"}>{o.trendingPct > 0 ? `${o.trendingPct}%` : "stable"}</span>
          <span className="text-ink-400 hidden sm:inline">· {o.cookieLength} cookie</span>
        </div>
        <span className="text-xs font-semibold text-brand-700 flex items-center gap-1 group-hover:gap-1.5 transition-all">View <ExternalLink className="h-3 w-3" /></span>
      </div>
    </Card>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 py-2">
      <p className="flex items-center justify-center gap-1 text-[10px] uppercase text-ink-400 font-semibold">{icon}{label}</p>
      <p className="text-sm font-bold text-ink-900 mt-0.5">{value}</p>
    </div>
  );
}

function OfferDetail({ o, onClose, isGuest }: { o: Offer; onClose: () => void; isGuest: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" />
      <Card className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-b-none sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[linear-gradient(135deg,rgba(37,71,247,0.1),rgba(124,58,237,0.1))] flex items-center justify-center text-4xl shrink-0">{o.image}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase text-violet-600 tracking-wider">{o.networkName}</p>
              <h2 className="text-lg font-extrabold leading-tight">{o.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                {o.recurring && <Badge tone="green"><Repeat className="h-3 w-3" />Recurring</Badge>}
                <Badge tone="gray">{o.category}</Badge>
              </div>
            </div>
          </div>
          <p className="text-sm text-ink-600 mt-4">{o.description}</p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <Stat label="Commission" value={o.commission} />
            <Stat label="Earnings per click" value={`$${o.epc}`} />
            <Stat label="Conversion rate" value={`${o.conversionRate}%`} />
            <Stat label="Cookie length" value={o.cookieLength} />
            <Stat label="Payout" value={o.payout} />
            <Stat label="Influencer fit" value={`${o.influencerFit}/100`} />
          </div>

          <div className="mt-5 rounded-xl bg-brand-50 border border-brand-100 p-4 flex gap-2.5">
            <Sparkles className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-brand-900">Strategy tip</p>
              <p className="text-xs text-brand-800 mt-0.5">{o.strategyTip}</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">Best platforms</p>
            <div className="flex flex-wrap gap-1.5">
              {o.tags.map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-ink-100 text-ink-700">#{t}</span>)}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <a href={o.url} target="_blank" rel="noreferrer" className="btn-premium flex-1 justify-center">
              {isGuest ? "View on network (demo)" : "Join program"} <ExternalLink className="h-4 w-4" />
            </a>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
          {isGuest && <p className="text-[11px] text-amber-600 mt-2 text-center">Demo mode — links go to the real network but no tracking is connected.</p>}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3">
      <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">{label}</p>
      <p className="text-sm font-bold text-ink-900 mt-1">{value}</p>
    </div>
  );
}
