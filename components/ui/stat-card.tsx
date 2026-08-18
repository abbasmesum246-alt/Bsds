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
    brand: "bg-brand-50 text-brand-600", green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600", amber: "bg-amber-50 text-amber-600", sky: "bg-sky-50 text-sky-600",
  };
  const display = format === "currency" ? formatCurrency(value, currency)
    : format === "compact" ? new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
    : value.toLocaleString();
  return (
    <Card className="p-5 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <p className="text-2xl font-bold text-ink-900 mt-1.5 tracking-tight">{display}</p>
        </div>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", tones[tone])}>{icon}</div>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded",
            positive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50")}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-ink-400">vs last 30 days</span>
        </div>
      )}
    </Card>
  );
}
