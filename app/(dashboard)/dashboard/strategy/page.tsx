"use client";
import * as React from "react";
import {
  Target, Sparkles, MousePointerClick, TrendingUp, Lightbulb,
  Copy, Check, Loader2, Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { useToast } from "@/components/ui/toast";
import { useAffiliateMode } from "@/components/affiliate/mode-context";
import { cn } from "@/lib/utils";

interface Strategy {
  id: string; title: string; platform: string; offer: string; angle: string;
  contentFormat: string; hook: string; cta: string; postingSchedule: string;
  expectedCtr: number; expectedConversion: number; tips: string[]; steps: string[];
}
interface Result {
  goal: string; platform: string; niche: string; summary: string;
  strategies: Strategy[]; clickGrowth: string[];
  recommendedOffers: { id: string; title: string; brand: string; commission: string; epc: number; conversionRate: number; image: string }[];
}

const PLATFORMS = [
  { id: "youtube", name: "YouTube", icon: "▶️" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "instagram", name: "Instagram", icon: "📸" },
  { id: "blog", name: "Blog / SEO", icon: "✍️" },
  { id: "email", name: "Email", icon: "📧" },
  { id: "pinterest", name: "Pinterest", icon: "📌" },
  { id: "twitter", name: "X / Twitter", icon: "🐦" },
];
const NICHES = ["SaaS", "Fashion", "Beauty", "Finance", "Fitness", "Tech", "Education", "Gaming", "Travel", "Food"];

export default function StrategyPage() {
  const { mode } = useAffiliateMode();
  const toast = useToast();
  const [niche, setNiche] = React.useState("");
  const [platform, setPlatform] = React.useState("youtube");
  const [audience, setAudience] = React.useState("");
  const [goal, setGoal] = React.useState("Maximize commissions");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [webResults, setWebResults] = React.useState<{ title: string; url: string; snippet: string; source: string }[]>([]);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/affiliate/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: niche || "general", platform, audience, goal }),
      });
      const data = await res.json();
      setResult(data);
      // Also try live web search
      try {
        const ws = await fetch(`/api/affiliate/search?q=best+${encodeURIComponent(niche || platform)}+affiliate+programs+2026`).then((r) => r.json());
        if (ws.enabled) setWebResults(ws.results.slice(0, 5));
      } catch { /* live search optional */ }
    } finally { setLoading(false); }
  }

  function copy(text: string, id: string) {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-5 animate-in">
      <PageHeader title="AI Strategy Generator" description="Tell us your niche and platform — get a complete content and promotion plan with offers." icon={<Target className="h-5 w-5" />} />

      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <Label>1. Choose your platform</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-2">
              {PLATFORMS.map((p) => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className={cn("flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition text-xs font-semibold", platform === p.id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-ink-100 hover:border-ink-300")}>
                  <span className="text-xl">{p.icon}</span>{p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>2. Your niche</Label>
              <Input list="niches" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. SaaS, fitness, personal finance" />
              <datalist id="niches">{NICHES.map((n) => <option key={n} value={n} />)}</datalist>
            </div>
            <div>
              <Label>3. Your goal</Label>
              <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Maximize recurring commissions" />
            </div>
          </div>
          <div>
            <Label>Audience (optional)</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. beginners aged 18–30 interested in side hustles" />
          </div>
          <Button onClick={generate} disabled={loading} size="lg" className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Building your strategy…</> : <><Sparkles className="h-4 w-4" />Generate Strategy</>}
          </Button>
          {mode === "guest" && <p className="text-[11px] text-amber-600 text-center">Demo mode — strategies are fully functional with virtual data.</p>}
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <div className="grid md:grid-cols-2 gap-4"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
        </div>
      )}

      {result && !loading && (
        <>
          <Card className="border-0 bg-[linear-gradient(135deg,#4f46e5,#0d9488)] text-white">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-white/70 font-bold">Your strategy summary</p>
              <p className="mt-2 text-lg font-semibold leading-snug">{result.summary}</p>
            </CardContent>
          </Card>

          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Target className="h-5 w-5 text-brand-600" />Campaign plans</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {result.strategies.map((s) => (
                <Card key={s.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">{s.title}</CardTitle>
                      <Badge tone="brand" className="capitalize">{s.platform}</Badge>
                    </div>
                    <CardDescription>{s.offer}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-1">Hook</p>
                      <p className="text-sm text-ink-700 bg-ink-50 rounded-lg p-2.5 flex gap-2">
                        <span className="flex-1">{s.hook}</span>
                        <button onClick={() => copy(s.hook, s.id + "-hook")} className="text-ink-400 hover:text-brand-600 shrink-0">
                          {copied === s.id + "-hook" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Info label="Format" value={s.contentFormat} />
                      <Info label="CTA" value={s.cta} />
                      <Info label="Schedule" value={s.postingSchedule} />
                      <div className="rounded-lg bg-ink-50 p-2">
                        <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">Expected</p>
                        <p className="font-bold text-ink-900 mt-0.5 flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3 text-brand-600" />{s.expectedCtr}% CTR
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-1.5">Steps</p>
                      <ol className="space-y-1.5">
                        {s.steps.map((step, i) => (
                          <li key={i} className="text-xs text-ink-600 flex gap-2">
                            <span className="h-4 w-4 shrink-0 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    {s.tips.length > 0 && (
                      <div className="rounded-lg bg-amber-50 border border-amber-100 p-2.5 space-y-1">
                        {s.tips.map((t, i) => <p key={i} className="text-[11px] text-amber-900 flex gap-1.5"><Lightbulb className="h-3 w-3 shrink-0 mt-0.5" />{t}</p>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-600" />How to increase clicks</CardTitle></CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-3">
                {result.clickGrowth.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-ink-700 p-2.5 rounded-lg bg-ink-50">
                    <span className="h-5 w-5 shrink-0 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {webResults.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-brand-600" />Live web results</CardTitle>
                <CardDescription>Real-time opportunities found on the web.</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {webResults.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer" className="block group">
                    <p className="text-xs text-ink-400">{r.source}</p>
                    <p className="text-sm font-semibold text-brand-700 group-hover:underline">{r.title}</p>
                    <p className="text-xs text-ink-600 line-clamp-2">{r.snippet}</p>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 p-2">
      <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">{label}</p>
      <p className="text-xs font-semibold text-ink-900 mt-0.5">{value}</p>
    </div>
  );
}
