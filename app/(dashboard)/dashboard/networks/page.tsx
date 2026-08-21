"use client";
import * as React from "react";
import { Search, Star, ExternalLink, Globe, DollarSign, Clock, CheckCircle2, X, Award, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

interface Network {
  id: string; name: string; url: string; signupUrl: string; category: string;
  commissionRate: string; cookieLength: string; payoutType: string; minPayout: string;
  payoutMethods: string[]; rating: number; founded: number; merchants: number;
  regions: string[]; pros: string[]; cons: string[]; bestFor: string;
  approvalDifficulty: "easy" | "medium" | "hard"; trackingReliability: number; score: number;
}

export default function NetworksPage() {
  const [items, setItems] = React.useState<Network[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [sort, setSort] = React.useState("best");
  const [facets, setFacets] = React.useState<string[]>([]);
  const sentinel = React.useRef<HTMLDivElement>(null);

  const load = React.useCallback(async (reset = false) => {
    if (reset) { setLoading(true); setPage(1); setItems([]); setHasMore(true); } else setLoadingMore(true);
    const params = new URLSearchParams({ q, category, sort, page: String(reset ? 1 : page), limit: "8" });
    const data = await fetch(`/api/affiliate/networks?${params}`).then((r) => r.json());
    setFacets(data.categories);
    setItems((p) => reset ? data.items : [...p, ...data.items]);
    setHasMore(data.hasMore);
    setPage((p) => (reset ? 2 : p + 1));
    setLoading(false); setLoadingMore(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, sort]);

  React.useEffect(() => { const t = setTimeout(() => load(true), 250); return () => clearTimeout(t); }, [load]);

  React.useEffect(() => {
    if (!sentinel.current) return;
    const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting && hasMore && !loading && !loadingMore) load(false); }, { rootMargin: "300px" });
    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, load]);

  return (
    <div className="space-y-5 animate-in">
      <PageHeader title="Affiliate Networks" description="Compare real networks — commissions, cookies, reliability, and who they're best for." icon={<Award className="h-5 w-5" />} />

      <Card className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search networks, categories, strengths…" className="pl-9" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium outline-none cursor-pointer">
            <option value="best">🏆 Best match</option>
            <option value="rating">⭐ Highest rated</option>
            <option value="merchants">🏪 Most merchants</option>
            <option value="easiest">✅ Easiest approval</option>
          </select>
          <button onClick={() => setCategory("")} className={cn("text-xs px-2.5 py-1.5 rounded-full font-medium", !category ? "bg-brand-600 text-white" : "bg-ink-100 hover:bg-ink-200")}>All</button>
          {facets.map((c) => (
            <button key={c} onClick={() => setCategory(category === c ? "" : c)} className={cn("text-xs px-2.5 py-1.5 rounded-full font-medium capitalize", category === c ? "bg-brand-600 text-white" : "bg-ink-100 hover:bg-ink-200")}>{c}</button>
          ))}
        </div>
      </Card>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)}</div>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<Search className="h-7 w-7" />} title="No networks found" description="Try a different search." action={<Button onClick={() => { setQ(""); setCategory(""); }}>Clear</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((n) => <NetworkCard key={n.id} n={n} />)}
        </div>
      )}

      <div ref={sentinel} className="flex justify-center py-6">
        {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-brand-500" />}
        {!hasMore && items.length > 0 && <p className="text-sm text-ink-400">All {items.length} networks loaded</p>}
      </div>
    </div>
  );
}

function NetworkCard({ n }: { n: Network }) {
  const [expanded, setExpanded] = React.useState(false);
  const diffColor = n.approvalDifficulty === "easy" ? "text-emerald-600 bg-emerald-50" : n.approvalDifficulty === "medium" ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  return (
    <Card className="overflow-hidden hover:shadow-soft transition">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-ink-900 truncate">{n.name}</h3>
              <Badge tone="gray" className="capitalize">{n.category}</Badge>
            </div>
            <a href={n.url} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1 mt-0.5">
              {n.url.replace(/^https?:\/\//, "")}<ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="text-center shrink-0">
            <div className={cn("rounded-lg px-2 py-1", n.score >= 75 ? "bg-emerald-50 text-emerald-700" : n.score >= 55 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>
              <p className="text-[9px] font-bold uppercase leading-none">Score</p>
              <p className="text-lg font-extrabold leading-none mt-0.5">{n.score}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <Mini icon={<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />} label="Rating" value={n.rating.toFixed(1)} />
          <Mini icon={<DollarSign className="h-3.5 w-3.5" />} label="Rate" value={n.commissionRate.split("–")[0]} />
          <Mini icon={<Clock className="h-3.5 w-3.5" />} label="Cookie" value={n.cookieLength.split(" ")[0]} />
          <Mini icon={<Globe className="h-3.5 w-3.5" />} label="Brands" value={n.merchants >= 1000 ? `${(n.merchants / 1000).toFixed(0)}k+` : String(n.merchants)} />
        </div>

        <p className="mt-3 text-xs italic text-ink-500">Best for: {n.bestFor}</p>

        <button onClick={() => setExpanded((v) => !v)} className="mt-3 w-full text-xs font-bold text-brand-600">
          {expanded ? "Hide details ▲" : "See pros, cons & payout ▼"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 animate-in">
            <div className="flex items-center gap-2">
              <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded", diffColor)}>
                Approval: {n.approvalDifficulty}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-ink-100 text-ink-600">
                Tracking: {n.trackingReliability}%
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-ink-100 text-ink-600">{n.payoutType}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-bold text-emerald-700 mb-1.5 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Pros</p>
                <ul className="space-y-1">{n.pros.map((p) => <li key={p} className="text-ink-600 flex gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />{p}</li>)}</ul>
              </div>
              <div>
                <p className="font-bold text-red-700 mb-1.5 flex items-center gap-1"><X className="h-3.5 w-3.5" />Cons</p>
                <ul className="space-y-1">{n.cons.map((c) => <li key={c} className="text-ink-600 flex gap-1"><X className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />{c}</li>)}</ul>
              </div>
            </div>
            <div className="text-xs text-ink-600 bg-ink-50 rounded-lg p-2.5">
              <strong>Min payout:</strong> {n.minPayout}<br />
              <strong>Methods:</strong> {n.payoutMethods.join(", ")}
            </div>
            <a href={n.signupUrl} target="_blank" rel="noreferrer" className="btn-premium w-full justify-center text-xs">
              Join {n.name} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 py-2">
      <p className="flex items-center justify-center gap-1 text-[9px] uppercase text-ink-400 font-bold">{icon}{label}</p>
      <p className="text-xs font-bold text-ink-900 mt-0.5 truncate px-1">{value}</p>
    </div>
  );
}
