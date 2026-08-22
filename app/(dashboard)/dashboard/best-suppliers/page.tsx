"use client";
import * as React from "react";
import {
  Search, Star, Truck, Globe, ExternalLink, Zap, Check, X,
  Sparkles, Clock, Package, Loader2, SlidersHorizontal, Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string; name: string; url: string; category: string; regions: string[];
  shippingDays: string; products: string; pricing: string; moq: string;
  rating: number; founded: number; pros: string[]; cons: string[];
  bestFor: string; integration: "native" | "api" | "manual";
  logo: string; score: number;
}

export default function BestSuppliersPage() {
  const [items, setItems] = React.useState<Supplier[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [sort, setSort] = React.useState("bestmatch");
  const [facets, setFacets] = React.useState<{ categories: string[]; regions: string[] }>({ categories: [], regions: [] });
  const [showFilters, setShowFilters] = React.useState(false);
  const sentinel = React.useRef<HTMLDivElement>(null);

  const load = React.useCallback(async (reset = false) => {
    if (reset) { setLoading(true); setPage(1); setItems([]); setHasMore(true); }
    else setLoadingMore(true);
    try {
      const params = new URLSearchParams({ q, category, region, sort, page: String(reset ? 1 : page), limit: "8" });
      const res = await fetch(`/api/suppliers-directory?${params}`);
      const data = await res.json();
      setFacets({ categories: data.categories, regions: data.regions });
      setItems((prev) => reset ? data.items : [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage((p) => (reset ? 2 : p + 1));
    } finally {
      setLoading(false); setLoadingMore(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, region, sort]);

  // Initial + filter/sort reload
  React.useEffect(() => {
    const t = setTimeout(() => load(true), 250);
    return () => clearTimeout(t);
  }, [load]);

  // Infinite scroll
  React.useEffect(() => {
    if (!sentinel.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
        load(false);
      }
    }, { rootMargin: "200px" });
    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, load, items.length]);

  function resetFilters() {
    setQ(""); setCategory(""); setRegion(""); setSort("bestmatch");
  }

  return (
    <div className="space-y-5 animate-in">
      <PageHeader
        title="Best Suppliers"
        description="Curated dropshipping suppliers, ranked by real-world performance. Scroll to load more."
        icon={<Award className="h-5 w-5" />}
        action={
          <a href="https://cjdropshipping.com" target="_blank" rel="noreferrer" className="btn-premium">
            <Zap className="h-4 w-4" /> Top pick: CJ Dropshipping
          </a>
        }
      />

      {/* Search + sort */}
      <Card className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search suppliers, categories, niches…" className="pl-9" />
          </div>
          <div className="flex gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none cursor-pointer">
              <option value="bestmatch">🏆 Best match</option>
              <option value="rating">⭐ Highest rated</option>
              <option value="shipping">🚚 Fastest shipping</option>
              <option value="products">📦 Most products</option>
              <option value="price">💰 Free / cheapest</option>
              <option value="newest">🆕 Newest</option>
              <option value="name">🔤 Name A-Z</option>
            </select>
            <Button variant="secondary" size="icon" onClick={() => setShowFilters((v) => !v)} aria-label="Filters">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-ink-100 grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input mt-1 cursor-pointer">
                <option value="">All categories</option>
                {facets.categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="input mt-1 cursor-pointer">
                <option value="">All regions</option>
                {facets.regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={resetFilters}>Clear filters</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Search className="h-7 w-7" />}
            title="No suppliers match your filters"
            description="Try a different search term, or clear filters to see all suppliers."
            action={<Button onClick={resetFilters}>Clear filters</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((s, i) => <SupplierCard key={s.id} s={s} rank={i + 1 + ((page - 2) * 8)} />)}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinel} className="flex justify-center py-6">
        {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-brand-500" />}
        {!hasMore && items.length > 0 && (
          <p className="text-sm text-ink-400 flex items-center gap-1.5">
            <Check className="h-4 w-4" /> You've seen all {items.length} suppliers
          </p>
        )}
      </div>

      <LiveSearchHint q={q} />
    </div>
  );
}

function SupplierCard({ s, rank }: { s: Supplier; rank: number }) {
  const [expanded, setExpanded] = React.useState(false);
  const scoreColor =
    s.score >= 75 ? "text-emerald-600 bg-emerald-50" :
    s.score >= 55 ? "text-amber-600 bg-amber-50" :
    "text-red-600 bg-red-50";

  return (
    <Card className="overflow-hidden hover:shadow-soft transition group">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(135deg,rgba(37,71,247,0.1),rgba(124,58,237,0.1))] flex items-center justify-center text-3xl shrink-0 ring-1 ring-brand-100">
            {s.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-ink-900 leading-tight flex items-center gap-2">
                  {rank <= 3 && <span className="text-amber-500">
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                  </span>}
                  {s.name}
                </h3>
                <a href={s.url} target="_blank" rel="noreferrer"
                  className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1 mt-0.5 truncate max-w-full">
                  {s.url.replace(/^https?:\/\//, "")}<ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
              <div className={cn("rounded-lg px-2 py-1 text-center shrink-0", scoreColor)}>
                <p className="text-[10px] font-semibold uppercase leading-none">Score</p>
                <p className="text-lg font-extrabold leading-none mt-0.5">{s.score}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge tone="brand">{s.category}</Badge>
              {s.integration === "native" && <Badge tone="green"><Zap className="h-3 w-3" />Native</Badge>}
              {s.integration === "api" && <Badge tone="blue">API</Badge>}
              {s.integration === "manual" && <Badge tone="gray">Manual</Badge>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <Stat icon={<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />} label="Rating" value={s.rating.toFixed(1)} />
          <Stat icon={<Truck className="h-3.5 w-3.5" />} label="Shipping" value={s.shippingDays + "d"} />
          <Stat icon={<Package className="h-3.5 w-3.5" />} label="Products" value={s.products} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-600">
          <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-ink-400" />MOQ: {s.moq}</p>
          <p className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-ink-400" />{s.regions.slice(0, 2).join(", ")}{s.regions.length > 2 ? " +" : ""}</p>
        </div>

        <p className="mt-3 text-xs text-ink-500 italic flex items-start gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand-500 shrink-0 mt-0.5" />
          Best for: {s.bestFor}
        </p>

        <button onClick={() => setExpanded((v) => !v)}
          className="mt-3 w-full text-xs font-semibold text-brand-600 hover:text-brand-700">
          {expanded ? "Hide details ▲" : "View pros, cons & pricing ▼"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 animate-in">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Pricing</p>
              <p className="text-sm text-ink-700">{s.pricing}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1.5 flex items-center gap-1"><Check className="h-3.5 w-3.5" />Pros</p>
                <ul className="space-y-1">{s.pros.map((p) => <li key={p} className="text-xs text-ink-600 flex gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />{p}</li>)}</ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5 flex items-center gap-1"><X className="h-3.5 w-3.5" />Cons</p>
                <ul className="space-y-1">{s.cons.map((c) => <li key={c} className="text-xs text-ink-600 flex gap-1.5"><X className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />{c}</li>)}</ul>
              </div>
            </div>
            <a href={s.url} target="_blank" rel="noreferrer"
              className="block w-full text-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#0d9488)] text-white text-sm font-semibold py-2.5 hover:opacity-90 transition">
              Visit {s.name} →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 py-2 px-1">
      <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-ink-400 font-semibold">{icon}{label}</p>
      <p className="text-sm font-bold text-ink-900 mt-0.5">{value}</p>
    </div>
  );
}

function LiveSearchHint({ q }: { q: string }) {
  const [results, setResults] = React.useState<{ title: string; url: string; snippet: string; source: string }[]>([]);
  const [enabled, setEnabled] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let active = true;
    if (!q) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/web-search?q=${encodeURIComponent(q + " dropshipping supplier review")}`);
        const data = await res.json();
        if (active) { setEnabled(data.enabled); setResults(data.results || []); }
      } catch { /* ignore */ }
    }, 600);
    return () => { active = false; clearTimeout(t); };
  }, [q]);

  if (!q || enabled === false) return null;
  if (enabled === null) return null;

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-bold flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-brand-600" />
          Live web results for &ldquo;{q}&rdquo;
        </h3>
        {results.length === 0 ? (
          <p className="text-sm text-ink-500">No live results found.</p>
        ) : (
          <div className="space-y-3">
            {results.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noreferrer" className="block group">
                <p className="text-xs text-ink-400">{r.source}</p>
                <p className="text-sm font-semibold text-brand-700 group-hover:underline">{r.title}</p>
                <p className="text-xs text-ink-600 line-clamp-2">{r.snippet}</p>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
