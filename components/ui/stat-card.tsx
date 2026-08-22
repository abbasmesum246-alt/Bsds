import * as React from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, delta, icon, tone = "indigo", subtitle,
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon?: React.ReactNode;
  tone?: "indigo" | "teal" | "amber" | "rose" | "sky" | "violet";
  subtitle?: string;
}) {
  const colors: Record<string, { bg: string; text: string; ring: string }> = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", ring: "ring-teal-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100" },
    sky: { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-100" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
  };
  const c = colors[tone];
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="card-solid p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition" style={{ background: `radial-gradient(circle, ${tone === "indigo" ? "rgba(79,70,229,0.08)" : "rgba(13,148,136,0.08)"}, transparent)` }} />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">{label}</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center ring-1 shrink-0", c.bg, c.text, c.ring)}>
            {icon}
          </div>
        )}
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-extrabold px-1.5 py-0.5 rounded-md",
            positive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
          )}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400">vs last 30d</span>
        </div>
      )}
    </div>
  );
}
