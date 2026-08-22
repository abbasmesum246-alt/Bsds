import * as React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, delta, icon, tone = "violet", subtitle,
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon?: React.ReactNode;
  tone?: "violet" | "cyan" | "teal" | "amber" | "rose" | "indigo";
  subtitle?: string;
}) {
  const tones: Record<string, { grad: string; glow: string; chip: string }> = {
    violet: { grad: "from-violet-500 to-fuchsia-500", glow: "rgba(124,58,237,.22)", chip: "bg-violet-50 text-violet-600" },
    cyan:   { grad: "from-cyan-500 to-blue-500",    glow: "rgba(6,182,212,.22)",  chip: "bg-cyan-50 text-cyan-600" },
    teal:   { grad: "from-teal-500 to-emerald-500", glow: "rgba(13,148,136,.22)", chip: "bg-teal-50 text-teal-600" },
    amber:  { grad: "from-amber-500 to-orange-500", glow: "rgba(245,158,11,.22)", chip: "bg-amber-50 text-amber-600" },
    rose:   { grad: "from-rose-500 to-pink-500",    glow: "rgba(244,63,94,.22)",  chip: "bg-rose-50 text-rose-600" },
    indigo: { grad: "from-indigo-500 to-violet-500",glow: "rgba(99,102,241,.22)", chip: "bg-indigo-50 text-indigo-600" },
  };
  const t = tones[tone];
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="card-solid p-5 relative overflow-hidden group hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: t.glow }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] font-extrabold text-slate-400">{label}</p>
          <p className="text-[28px] leading-tight font-extrabold text-void-900 mt-2 tracking-tight tabular-nums">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 text-white shadow-soft bg-gradient-to-br",
            t.grad
          )}>
            {icon}
          </div>
        )}
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-extrabold px-1.5 py-0.5 rounded-md ring-1 ring-inset",
            positive ? "text-emerald-700 bg-emerald-50 ring-emerald-200/70" : "text-rose-700 bg-rose-50 ring-rose-200/70"
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
