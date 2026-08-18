"use client";
import * as React from "react";
import { Calculator, TrendingUp, TrendingDown, Package, Target, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

interface Result {
  sellPrice: number;
  compareAt: number;
  profit: number;
  profitMargin: number;
  markup: number;
  breakevenPrice: number;
  roas: number;
  verdict: "winner" | "ok" | "bad";
  fees: { payment: number; shipping: number; ads: number; platform: number };
}

const PRESETS = [
  { label: "Free + shipping", margin: 60, adPct: 15, feePct: 3, ship: 0 },
  { label: "Standard", margin: 45, adPct: 25, feePct: 5, ship: 3.99 },
  { label: "Aggressive scale", margin: 35, adPct: 35, feePct: 5, ship: 4.99 },
  { label: "Premium brand", margin: 65, adPct: 15, feePct: 3, ship: 0 },
];

export function PriceCalculator() {
  const [cost, setCost] = React.useState(9.99);
  const [shippingCost, setShippingCost] = React.useState(2.5);
  const [desiredMargin, setDesiredMargin] = React.useState(45);
  const [adPct, setAdPct] = React.useState(25);
  const [feePct, setFeePct] = React.useState(5);
  const [freeShipping, setFreeShipping] = React.useState(true);
  const [compareAtMult, setCompareAtMult] = React.useState(2.2);
  const [customSell, setCustomSell] = React.useState<string>("");

  const result: Result = React.useMemo(() => {
    const totalCost = Number(cost) + Number(shippingCost);
    const customerShip = freeShipping ? 0 : 4.99;
    // Solve: sell - totalCost - 0.029*sell - 0.30 - feePct*sell - adPct*sell = desiredMargin%*sell
    const feeRate = 0.029 + adPct / 100 + feePct / 100;
    const suggested = (totalCost + 0.3 - customerShip) / (1 - desiredMargin / 100 - feeRate);
    const sellPrice = customSell ? Number(customSell) : Math.max(suggested, totalCost * 1.8);
    const payment = sellPrice * 0.029 + 0.3;
    const ads = sellPrice * (adPct / 100);
    const platform = sellPrice * (feePct / 100);
    const profit = sellPrice - totalCost - payment - ads - platform - customerShip;
    const profitMargin = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
    const markup = totalCost > 0 ? ((sellPrice - totalCost) / totalCost) * 100 : 0;
    // Minimum price to not lose money (profit = 0)
    const breakevenPrice = (totalCost + 0.3 - customerShip) / (1 - feeRate);
    const roas = ads > 0 ? sellPrice / ads : 0;
    const verdict = profitMargin >= 25 ? "winner" : profitMargin >= 10 ? "ok" : "bad";
    return {
      sellPrice: Math.round(sellPrice * 100) / 100,
      compareAt: Math.round(sellPrice * compareAtMult * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      profitMargin: Math.round(profitMargin * 10) / 10,
      markup: Math.round(markup),
      breakevenPrice: Math.round(breakevenPrice * 100) / 100,
      roas: Math.round(roas * 10) / 10,
      verdict,
      fees: { payment: Math.round(payment * 100) / 100, shipping: Math.round(customerShip * 100) / 100, ads: Math.round(ads * 100) / 100, platform: Math.round(platform * 100) / 100 },
    };
  }, [cost, shippingCost, desiredMargin, adPct, feePct, freeShipping, compareAtMult, customSell]);

  function applyPreset(p: typeof PRESETS[0]) {
    setDesiredMargin(p.margin);
    setAdPct(p.adPct);
    setFeePct(p.feePct);
    setFreeShipping(p.ship === 0);
    setCustomSell("");
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Presets */}
      <Card className="overflow-hidden border-0 shadow-soft bg-gradient-to-br from-white to-brand-50/40">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">Quick strategy presets</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => applyPreset(p)}
                className="text-left px-3 py-2.5 rounded-xl border border-ink-200 bg-white hover:border-brand-400 hover:shadow-sm transition">
                <p className="text-sm font-semibold text-ink-900">{p.label}</p>
                <p className="text-xs text-ink-500 mt-0.5">{p.margin}% margin · {p.adPct}% ads</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inputs */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-brand-600" />Your costs</CardTitle>
            <CardDescription>Enter what you pay the supplier. We'll calculate the right price to charge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Product cost (supplier)" hint="e.g. AliExpress price">
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">$</span>
                  <Input type="number" step="0.01" min="0" value={cost} onChange={(e) => { setCost(Number(e.target.value)); setCustomSell(""); }} className="pl-7" />
                </div>
              </Field>
              <Field label="Shipping cost (you pay)" hint="to send to customer">
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">$</span>
                  <Input type="number" step="0.01" min="0" value={shippingCost} onChange={(e) => { setShippingCost(Number(e.target.value)); setCustomSell(""); }} className="pl-7" />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Target profit margin" hint="recommended 40%+">
                <div className="flex items-center gap-2">
                  <input type="range" min={10} max={80} value={desiredMargin}
                    onChange={(e) => { setDesiredMargin(Number(e.target.value)); setCustomSell(""); }}
                    className="flex-1 accent-brand-600" />
                  <span className="text-sm font-bold text-brand-700 w-10 text-right">{desiredMargin}%</span>
                </div>
              </Field>
              <Field label="Ad spend % of price" hint="Facebook/TikTok ads">
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={50} value={adPct}
                    onChange={(e) => { setAdPct(Number(e.target.value)); setCustomSell(""); }}
                    className="flex-1 accent-brand-600" />
                  <span className="text-sm font-bold text-brand-700 w-10 text-right">{adPct}%</span>
                </div>
              </Field>
            </div>

            <Field label="Platform/payment fee %" hint="eBay/Amazon/Stripe combined">
              <div className="flex items-center gap-2">
                <input type="range" min={0} max={15} step={0.5} value={feePct}
                  onChange={(e) => { setFeePct(Number(e.target.value)); setCustomSell(""); }}
                  className="flex-1 accent-brand-600" />
                <span className="text-sm font-bold text-brand-700 w-10 text-right">{feePct}%</span>
              </div>
            </Field>

            <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
              <div>
                <p className="text-sm font-medium text-ink-900">Offer free shipping to customer</p>
                <p className="text-xs text-ink-500">Higher conversion, you cover shipping cost</p>
              </div>
              <button onClick={() => { setFreeShipping(!freeShipping); setCustomSell(""); }}
                className={cn("relative h-6 w-11 rounded-full transition", freeShipping ? "bg-brand-600" : "bg-ink-300")}>
                <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition", freeShipping ? "left-[22px]" : "left-0.5")} />
              </button>
            </div>

            <Field label="Compare-at price multiplier" hint="strikethrough anchor price">
              <div className="flex items-center gap-2">
                <input type="range" min={1.3} max={3.5} step={0.1} value={compareAtMult}
                  onChange={(e) => setCompareAtMult(Number(e.target.value))}
                  className="flex-1 accent-brand-600" />
                <span className="text-sm font-bold text-brand-700 w-10 text-right">{compareAtMult}×</span>
              </div>
            </Field>

            <div>
              <Label>Or set your own sell price (optional)</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">$</span>
                <Input type="number" step="0.01" min="0" placeholder="Auto-calculated" value={customSell} onChange={(e) => setCustomSell(e.target.value)} className="pl-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className={cn("p-5 text-white",
            result.verdict === "winner" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" :
            result.verdict === "ok" ? "bg-gradient-to-br from-amber-500 to-amber-700" :
            "bg-gradient-to-br from-red-500 to-red-700")}>
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              {result.verdict === "winner" ? <><CheckCircle2 className="h-4 w-4" /> WINNER — sell it</> :
               result.verdict === "ok" ? <><Target className="h-4 w-4" /> Workable — test carefully</> :
               <><TrendingDown className="h-4 w-4" /> Warning — too thin</>}
            </div>
            <p className="text-4xl font-extrabold mt-3 tracking-tight">{formatCurrency(result.sellPrice)}</p>
            <p className="text-white/80 text-sm mt-1">Recommended selling price</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs">
              Compare-at <span className="line-through opacity-80">{formatCurrency(result.compareAt)}</span>
            </div>
          </div>
          <CardContent className="p-5 space-y-3">
            <Row label={<span className="flex items-center gap-1">Your profit <Tip text="Money left after EVERY cost — ads, fees, shipping, product." /></span>}
              value={formatCurrency(result.profit)} bold positive={result.profit >= 0} />
            <Row label="Profit margin" value={`${result.profitMargin}%`} positive={result.profitMargin >= 20} />
            <Row label="Markup" value={`${result.markup}%`} />
            <Row label="ROAS needed" value={`${result.roas}×`} positive={result.roas <= 3} />
            <div className="border-t border-ink-100 pt-3 mt-3 space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Cost breakdown per sale</p>
              <Row label="Product + shipping" value={formatCurrency(Number(cost) + Number(shippingCost))} muted />
              <Row label="Payment fees" value={formatCurrency(result.fees.payment)} muted />
              <Row label="Ad spend" value={formatCurrency(result.fees.ads)} muted />
              <Row label="Platform fees" value={formatCurrency(result.fees.platform)} muted />
            </div>
            <div className="rounded-lg bg-brand-50 p-3 text-xs text-brand-800 flex gap-2">
              <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Break-even price: {formatCurrency(result.breakevenPrice)}</p>
                <p className="text-brand-700/80 mt-0.5">Never sell below this — you'd lose money on every order.</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => navigator.clipboard?.writeText(String(result.sellPrice))}>
              Copy price to clipboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Learn */}
      <Card>
        <CardHeader><CardTitle className="text-base">🧠 The pricing rule most beginners break</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-ink-600 leading-relaxed">
          <p><strong className="text-ink-900">Never set price based only on supplier cost.</strong> A $10 product sold for $20 sounds like 100% profit — but after $5 ads, $1 fees and $3 shipping, you keep $1. That's a 5% margin, and one refund kills 10 orders.</p>
          <p><strong className="text-ink-900">Healthy dropshipping formula:</strong></p>
          <div className="rounded-lg bg-ink-900 text-ink-100 p-3 font-mono text-xs overflow-x-auto">
            Sell price = (product cost + shipping + $0.30) ÷ (1 − target margin% − ad% − fee%)
          </div>
          <ul className="space-y-1.5 list-disc pl-5">
            <li>Sell products that cost <strong>$1–$20</strong> — easy to mark up 2–3×</li>
            <li>Always aim for <strong>40%+ gross margin</strong> so ads don't eat you alive</li>
            <li>A <strong>compare-at price</strong> 2× higher makes your price feel like a deal</li>
            <li>If the calculator shows red, find a cheaper supplier or pick another product</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}
function Row({ label, value, bold, positive, muted }: { label: React.ReactNode; value: string; bold?: boolean; positive?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={cn(muted ? "text-ink-500" : "text-ink-600")}>{label}</span>
      <span className={cn(
        bold ? "font-bold text-base" : "font-semibold",
        positive === true ? "text-emerald-600" : positive === false ? "text-red-600" : muted ? "text-ink-500" : "text-ink-900"
      )}>{value}</span>
    </div>
  );
}
function Tip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <HelpCircle className="h-3.5 w-3.5 text-ink-400 cursor-help" />
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-ink-900 text-white text-[11px] p-2 opacity-0 group-hover:opacity-100 transition z-20 shadow-pop">{text}</span>
    </span>
  );
}
