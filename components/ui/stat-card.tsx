import * as React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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
  const colors: Record<string, { bg: string; text: string; ring: string; glow: string; grad: string }> = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100", glow: "rgba(99,102,241,.18)", grad: "from-indigo-500/15" },
    teal:   { bg: "bg-teal-50",   text: "text-teal-600",   ring: "ring-teal-100",   glow: "rgba(13,148,136,.18)", grad: "from-teal-500/15" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-600",  ring: "ring-amber-100",  glow: "rgba(245,158,11,.18)", grad: "from-amber-500/15" },
    rose:   { bg: "bg-rose-50",   text: "text-rose-600",   ring: "ring-rose-100",   glow: "rgba(244,63,94,.18)",  grad: "from-rose-500/15" },
    sky:    { bg: "bg-sky-50",    text: "text-sky-600",    ring: "ring-sky-100",    glow: "rgba(14,165,233,.18)", grad: "from-sky-500/15" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100", glow: "rgba(139,92,246,.18)", grad: "from-violet-500/15" },
  };
  const c = colors[tone];
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="card-solid p-5 relative overflow-hidden group hover:-translate-y-0.5">
      {/* corner glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: c.glow }}
      />
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent", c.grad, "from-transparent")} />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] font-extrabold text-slate-400">{label}</p>
          <p className="text-[26px] leading-tight font-extrabold text-slate-900 mt-2 tracking-tight tabular-nums">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center ring-1 shrink-0 shadow-soft", c.bg, c.text, c.ring)}>
            {icon}
          </div>
        )}
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-extrabold px-1.5 py-0.5 rounded-md",
            positive ? "text-emerald-700 bg-emerald-50 ring-1 ring-inset ring-emerald-200/70" : "text-rose-700 bg-rose-50 ring-1 ring-inset ring-rose-200/70"
          )}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400 font-medium">vs last 30d</span>
        </div>
      )}
    </div>
  );
}
