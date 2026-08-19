import { Card } from "./card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function StatCard({ label, value, delta, icon, tone = "brand", format = "number", currency = "USD" }: {
  label: string; value: number; delta?: number; icon: React.ReactNode;
  tone?: "brand" | "green" | "purple" | "amber" | "sky";
  format?: "number" | "currency" | "compact"; currency?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  const tones: Record<string, string> = {
    brand: "#2547f7", green: "#059669", purple: "#7c3aed", amber: "#d97706", sky: "#0284c7",
  };
  const toneColor = tones[tone];
  const display = format === "currency" ? formatCurrency(value, currency)
    : format === "compact" ? new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
    : value.toLocaleString();
  return (
    <div className="card-solid p-5 hover:shadow-soft transition-shadow relative overflow-hidden group">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.07] group-hover:opacity-10 transition-opacity"
        style={{ background: `radial-gradient(circle, ${toneColor}, transparent 70%)` }} />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <p className="text-2xl font-extrabold text-ink-900 mt-1.5 tracking-tight">{display}</p>
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm")}
          style={{ backgroundColor: `${toneColor}15`, color: toneColor }}>
          {icon}
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md",
            positive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50")}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-ink-400">vs last 30d</span>
        </div>
      )}
    </div>
  );
}
