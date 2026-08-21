"use client";
import * as React from "react";
import Link from "next/link";
import {
  Star, Plus, MousePointerClick, DollarSign, Trash2, Play, Pause,
  ExternalLink, Copy, Check, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useAffiliateMode } from "@/components/affiliate/mode-context";
import { cn, formatCurrency } from "@/lib/utils";
import type { Campaign } from "@/lib/affiliate/types";

const PLATFORMS: { id: Campaign["platform"]; name: string; icon: string }[] = [
  { id: "instagram", name: "Instagram", icon: "📸" },
  { id: "youtube", name: "YouTube", icon: "▶️" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "blog", name: "Blog", icon: "✍️" },
  { id: "email", name: "Email", icon: "📧" },
  { id: "twitter", name: "X/Twitter", icon: "🐦" },
  { id: "pinterest", name: "Pinterest", icon: "📌" },
  { id: "facebook", name: "Facebook", icon: "👍" },
];

export default function CampaignsPage() {
  const { mode } = useAffiliateMode();
  const toast = useToast();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState(false);
  const [form, setForm] = React.useState({ offerTitle: "", brand: "", platform: "instagram" as Campaign["platform"], link: "", notes: "" });
  const [copied, setCopied] = React.useState<string | null>(null);

  const isGuest = mode === "guest";
  const load = React.useCallback(() => {
    setLoading(true);
    fetch(`/api/affiliate/campaigns?mode=${mode}`)
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .finally(() => setLoading(false));
  }, [mode]);

  React.useEffect(() => { load(); }, [load]);

  // Simulate click growth for guest demo
  React.useEffect(() => {
    if (isGuest && campaigns.length > 0) {
      const t = setInterval(() => {
        setCampaigns((prev) => prev.map((c) => {
          if (c.status !== "active") return c;
          const add = Math.floor(Math.random() * 4);
          const conv = Math.random() < 0.05 ? 1 : 0;
          const rev = conv * (15 + Math.random() * 60);
          return { ...c, clicks: c.clicks + add, conversions: c.conversions + conv, revenue: Math.round((c.revenue + rev) * 100) / 100 };
        }));
      }, 3000);
      return () => clearInterval(t);
    }
  }, [isGuest, campaigns.length]);

  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConv = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalRev = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);

  async function createCampaign() {
    if (!form.offerTitle || !form.link) { toast.error("Missing info", "Add an offer name and affiliate link"); return; }
    try {
      const res = await fetch("/api/affiliate/campaigns", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, campaign: form }),
      });
      if (!res.ok) {
        const e = await res.json();
        toast.error("Can't create", e.error || "Switch to Account mode");
        return;
      }
      toast.success("Campaign created");
      setModal(false);
      setForm({ offerTitle: "", brand: "", platform: "instagram", link: "", notes: "" });
      load();
    } catch (e) { toast.error("Error", (e as Error).message); }
  }

  function toggleStatus(c: Campaign) {
    const newStatus: Campaign["status"] = c.status === "active" ? "paused" : "active";
    const updated = campaigns.map((x) => x.id === c.id ? { ...x, status: newStatus } : x);
    setCampaigns(updated);
    if (!isGuest) localStorage.setItem("bsds_affiliate_campaigns", JSON.stringify(updated));
  }
  function remove(id: string) {
    const updated = campaigns.filter((c) => c.id !== id);
    setCampaigns(updated);
    if (!isGuest) localStorage.setItem("bsds_affiliate_campaigns", JSON.stringify(updated));
    toast.success("Campaign removed");
  }
  function copyLink(c: Campaign) {
    navigator.clipboard?.writeText(c.link);
    setCopied(c.id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-5 animate-in">
      <PageHeader title="Campaigns" description={isGuest ? "Practice tracking — virtual clicks update in real time." : "Track every affiliate link and its earnings."} icon={<Star className="h-5 w-5" />}
        action={!isGuest ? <Button onClick={() => setModal(true)}><Plus className="h-4 w-4" />New Campaign</Button> :
          <Button variant="secondary" onClick={() => toast.info("Demo mode", "Switch to Account to create real campaigns")}><Plus className="h-4 w-4" />New Campaign</Button>} />

      {isGuest && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3 text-xs text-amber-800 flex items-center gap-2">
            <Play className="h-4 w-4" /> Demo mode active — watch virtual clicks & conversions come in every 3 seconds.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Kpi icon={<MousePointerClick className="h-5 w-5" />} label="Clicks" value={totalClicks.toLocaleString()} tone="#2547f7" />
        <Kpi icon={<DollarSign className="h-5 w-5" />} label="Conversions" value={totalConv.toLocaleString()} tone="#10b981" />
        <Kpi icon={<DollarSign className="h-5 w-5" />} label="Commission" value={formatCurrency(totalRev)} tone="#7c3aed" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : campaigns.length === 0 ? (
        <Card><EmptyState icon={<Star className="h-7 w-7" />} title="No campaigns yet" description="Create your first affiliate campaign to start tracking." action={<Button onClick={() => setModal(true)}><Plus className="h-4 w-4" />New Campaign</Button>} /></Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const platform = PLATFORMS.find((p) => p.id === c.platform);
            const cr = c.clicks ? ((c.conversions / c.clicks) * 100).toFixed(1) : "0.0";
            const epc = c.clicks ? c.revenue / c.clicks : 0;
            return (
              <Card key={c.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-ink-100 flex items-center justify-center text-xl shrink-0">{platform?.icon || "🔗"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm truncate">{c.offerTitle}</p>
                        <Badge tone={c.status === "active" ? "green" : c.status === "paused" ? "yellow" : "gray"}>{c.status}</Badge>
                      </div>
                      <p className="text-xs text-ink-500 truncate">{c.brand} · {platform?.name}</p>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div><p className="text-sm font-extrabold">{c.clicks.toLocaleString()}</p><p className="text-[10px] text-ink-400 uppercase">clicks</p></div>
                      <div><p className="text-sm font-extrabold">{c.conversions}</p><p className="text-[10px] text-ink-400 uppercase">conv ({cr}%)</p></div>
                      <div><p className="text-sm font-extrabold text-emerald-600">{formatCurrency(c.revenue)}</p><p className="text-[10px] text-ink-400 uppercase">earned</p></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => copyLink(c)} className="p-2 rounded-lg hover:bg-ink-100" title="Copy link">
                        {copied === c.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button onClick={() => toggleStatus(c)} className="p-2 rounded-lg hover:bg-ink-100" title={c.status === "active" ? "Pause" : "Activate"}>
                        {c.status === "active" ? <Pause className="h-4 w-4 text-amber-500" /> : <Play className="h-4 w-4 text-emerald-500" />}
                      </button>
                      <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  {c.contentIdea && (
                    <div className="mt-3 rounded-lg bg-brand-50 border border-brand-100 p-2.5 text-xs text-brand-900">
                      <strong>💡 Content idea:</strong> {c.contentIdea}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-400 truncate">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{c.link}</span>
                    <span className="shrink-0">· EPC ${epc.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New Campaign"
        footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={createCampaign}>Create</Button></>}>
        <div className="space-y-4">
          <div>
            <Label>What are you promoting?</Label>
            <Input value={form.offerTitle} onChange={(e) => setForm({ ...form, offerTitle: e.target.value })} placeholder="e.g. NordVPN — best security deal" />
          </div>
          <div>
            <Label>Brand</Label>
            <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. NordVPN" />
          </div>
          <div>
            <Label>Platform</Label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {PLATFORMS.map((p) => (
                <button key={p.id} onClick={() => setForm({ ...form, platform: p.id })}
                  className={cn("flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-[10px] font-semibold", form.platform === p.id ? "border-brand-500 bg-brand-50" : "border-ink-100")}>
                  <span className="text-lg">{p.icon}</span>{p.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Your affiliate link</Label>
            <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://your-affiliate-link" />
          </div>
          <div>
            <Label>Notes / content idea</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="What angle or content will you create?" />
          </div>
        </div>
      </Modal>

      <div className="text-center">
        <Link href="/dashboard/offers" className="text-sm text-brand-600 hover:underline">← Browse offers to promote</Link>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="card-solid p-4">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tone}15`, color: tone }}>{icon}</div>
        <div><p className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">{label}</p><p className="text-lg font-extrabold">{value}</p></div>
      </div>
    </div>
  );
}
