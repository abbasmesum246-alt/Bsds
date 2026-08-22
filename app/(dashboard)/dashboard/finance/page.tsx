"use client";
import * as React from "react";
import { BarChart3, TrendingUp, TrendingDown, Target, BookOpen, Lightbulb, Trophy, Skull, HelpCircle } from "lucide-react";
import { useQuery } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

interface Metrics {
  summary: Record<string, number>;
  operations: Record<string, number>;
  marketing: Record<string, number>;
  insights: { winners: number; losers: number; untested: number; advice: string[] };
  products: { id: string; title: string; image: string; sold: number; revenue: number; profit: number; margin: number; status: string; stock: number; health: string }[];
  glossary: { term: string; formula: string; why: string }[];
}

export default function FinancePage() {
  const { data, loading } = useQuery<Metrics>("/api/metrics");
  const [tab, setTab] = React.useState<"overview" | "products" | "learn">("overview");

  if (loading || !data) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const s = data.summary;
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Finance & Profit"
        description="Real dropshipping numbers — the same formulas professionals check daily. Tap any (?) to learn what it means."
        icon={<BarChart3 className="h-5 w-5" />}
        action={<Badge tone={s.netProfit >= 0 ? "green" : "red"}>
          {s.netProfit >= 0 ? "PROFITABLE" : "LOSS"} · {formatCurrency(s.netProfit)}
        </Badge>}
      />

      <div className="flex gap-2">
        {[["overview", "Overview"], ["products", "Product Health"], ["learn", "Learn the Terms"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id as typeof tab)}
            className={cn("px-3.5 py-1.5 rounded-full text-sm font-medium", tab === id ? "bg-violet-600 text-white" : "bg-white border border-ink-200 text-ink-600 hover:bg-ink-50")}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          {/* Profit waterfall */}
          <Card>
            <CardHeader><CardTitle>Where does the money go?</CardTitle>
              <CardDescription>Every $100 of sales gets eaten by these costs before it's truly yours.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <MoneyRow label="Gross Revenue (money in)" value={s.grossRevenue} color="bg-emerald-500" explain="Everything customers paid you." />
                <MoneyRow label="− Cost of Goods (supplier)" value={-s.cogs} color="bg-red-400" explain="What you pay AliExpress/supplier for the product." negative />
                <MoneyRow label="− Payment fees (Stripe/PayPal ~2.9%+$0.30)" value={-s.paymentFees} color="bg-red-400" negative explain="Every card payment charges a fee." />
                <MoneyRow label="− Ad spend (Facebook/TikTok)" value={-s.adSpend} color="bg-red-400" negative explain="The #1 cost in dropshipping. Demo = 25% of sales." />
                <MoneyRow label="− Platform fees (eBay/Amazon ~5%)" value={-s.platformFees} color="bg-red-400" negative explain="Marketplaces charge per sale." />
                <MoneyRow label="− Shipping cost" value={-s.shippingCost} color="bg-red-400" negative explain="What the supplier charges you to ship." />
                <MoneyRow label="− Refunds" value={-s.refunds} color="bg-red-400" negative explain="Money returned to unhappy customers." />
                <div className="border-t-2 border-ink-200 pt-3 flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">Net Profit (truly yours)
                    <Tip text="Revenue minus ALL costs. This is what pays your bills." />
                  </span>
                  <span className={s.netProfit >= 0 ? "text-emerald-600 text-lg" : "text-red-600 text-lg"}>
                    {s.netProfit >= 0 ? "+" : ""}{formatCurrency(s.netProfit)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key ratios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={<TrendingUp className="h-5 w-5" />} label="Gross Margin" value={`${s.grossMargin}%`}
              good={s.grossMargin >= 40} warn={s.grossMargin >= 25}
              tip="(Revenue − COGS) ÷ Revenue. Aim for 40%+. Below 20% is dangerous after ads." />
            <MetricCard icon={<Target className="h-5 w-5" />} label="Net Margin" value={`${s.netMargin}%`}
              good={s.netMargin >= 15} warn={s.netMargin >= 5}
              tip="Net profit ÷ Revenue. 15%+ is healthy; under 0% you're losing money." />
            <MetricCard icon={<TrendingUp className="h-5 w-5" />} label="ROAS" value={`${data.marketing.roas}x`}
              good={data.marketing.roas >= 3} warn={data.marketing.roas >= 2}
              tip="Revenue ÷ ad spend. 2.0 = break-even; 3.0+ means scale your ads." />
            <MetricCard icon={<TrendingDown className="h-5 w-5" />} label="Refund Rate" value={`${data.operations.refundRate}%`}
              good={data.operations.refundRate < 5} warn={data.operations.refundRate < 10} invert
              tip="Refunds ÷ orders. Under 5% is good; over 10% means a product or supplier problem." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard title="Per order" rows={[
              ["Average Order Value (AOV)", formatCurrency(data.operations.aov)],
              ["Profit per order", formatCurrency(s.netProfit / Math.max(data.operations.orders, 1))],
              ["Customer Acq. Cost (CAC)", formatCurrency(data.marketing.cac)],
              ["Customer Lifetime Value", formatCurrency(data.marketing.ltv)],
            ]} />
            <InfoCard title="Marketing" rows={[
              ["Estimated visitors", formatNumber(data.marketing.visitors)],
              ["Conversion rate", `${data.marketing.conversionRate}%`],
              ["Cost per click", formatCurrency(data.marketing.cpc)],
              ["Ad spend", formatCurrency(data.marketing.adSpend)],
            ]} />
            <InfoCard title="Operations" rows={[
              ["Orders", formatNumber(data.operations.orders)],
              ["Units sold", formatNumber(data.operations.unitsSold)],
              ["Fulfillment rate", `${data.operations.fulfillmentRate}%`],
              ["Break-even orders/month", `${data.operations.breakEvenOrders}`],
            ]} />
          </div>

          {/* Advice */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" />What to do next</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.insights.advice.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="h-6 w-6 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-ink-700">{a}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {tab === "products" && (
        <Card>
          <CardHeader><CardTitle>Product health score</CardTitle>
            <CardDescription>Green = winner (scale it). Red = kill it (losing money). Gray = too early to judge.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {data.products.length === 0 ? (
              <EmptyState compact icon={<BarChart3 className="h-6 w-6" />} title="No product sales yet" />
            ) : (
              <div className="divide-y divide-ink-100">
                {data.products.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="h-11 w-11 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${p.image}")` }} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <p className="text-xs text-ink-500">{p.sold} sold · {p.stock} in stock · {p.margin}% margin</p>
                    </div>
                    <div className="text-right mr-2">
                      <p className="text-sm font-semibold">{formatCurrency(p.profit)}</p>
                      <p className="text-xs text-ink-400">profit</p>
                    </div>
                    {p.health === "winner" && <Badge tone="green"><Trophy className="h-3 w-3" />Winner</Badge>}
                    {p.health === "kill" && <Badge tone="red"><Skull className="h-3 w-3" />Kill</Badge>}
                    {p.health === "ok" && <Badge tone="blue">OK</Badge>}
                    {p.health === "test" && <Badge tone="gray">Testing</Badge>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "learn" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-violet-600" />Learn the terms like a pro</CardTitle>
            <CardDescription>These are the exact words real dropshippers use. Read one a day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {data.glossary.map((g) => (
                <div key={g.term} className="rounded-lg border border-ink-100 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-ink-900">{g.term}</h4>
                    <code className="text-[11px] bg-ink-100 px-1.5 py-0.5 rounded text-ink-600">{g.formula}</code>
                  </div>
                  <p className="text-sm text-ink-600 mt-1.5">{g.why}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <HelpCircle className="h-4 w-4 text-ink-400 cursor-help" />
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-ink-900 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition z-10 shadow-pop">{text}</span>
    </span>
  );
}

function MoneyRow({ label, value, color, negative, explain }: { label: string; value: number; color: string; negative?: boolean; explain: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("h-8 w-1.5 rounded-full", color)} />
      <div className="flex-1">
        <p className="text-sm font-medium text-ink-800 flex items-center gap-1.5">{label}<Tip text={explain} /></p>
      </div>
      <span className={cn("font-semibold tabular-nums", negative ? "text-red-600" : "text-emerald-700")}>
        {negative ? "−" : "+"}{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}

function MetricCard({ icon, label, value, good, warn, invert, tip }: { icon: React.ReactNode; label: string; value: string; good?: boolean; warn?: boolean; invert?: boolean; tip: string }) {
  const tone = invert
    ? (good ? "text-emerald-600 bg-emerald-50" : warn ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50")
    : (good ? "text-emerald-600 bg-emerald-50" : warn ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50");
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-500 flex items-center gap-1">{label}<Tip text={tip} /></p>
          <p className={cn("text-2xl font-bold mt-1.5", tone.split(" ")[0])}>{value}</p>
        </div>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", tone)}>{icon}</div>
      </div>
      <p className={cn("mt-3 text-xs font-medium px-2 py-1 rounded inline-block",
        good ? "bg-emerald-50 text-emerald-700" : warn ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>
        {good ? "✓ Healthy" : warn ? "⚠ Watch it" : "✕ Fix this"}
      </p>
    </Card>
  );
}

function InfoCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-sm">
            <span className="text-ink-500">{k}</span>
            <span className="font-semibold">{v}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
