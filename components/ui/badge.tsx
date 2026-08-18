import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "gray" | "green" | "yellow" | "red" | "blue" | "purple" | "brand" | "orange";
const tones: Record<Tone, string> = {
  gray: "bg-ink-100 text-ink-700",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  blue: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  purple: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200",
  orange: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
};

export function Badge({ tone = "gray", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn("badge", tones[tone], className)} {...props} />;
}

const statusTone: Record<string, Tone> = {
  active: "green", inactive: "gray", out_of_stock: "red", monitoring: "blue",
  pending: "yellow", processing: "blue", shipped: "purple", delivered: "green",
  cancelled: "red", returned: "orange", awaiting_order: "yellow", ordered: "blue",
  failed: "red", connected: "green", disconnected: "gray", error: "red",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone[status] ?? "gray";
  const dot: Record<Tone, string> = {
    gray: "bg-ink-400", green: "bg-emerald-500", yellow: "bg-amber-500",
    red: "bg-red-500", blue: "bg-sky-500", purple: "bg-violet-500",
    brand: "bg-brand-500", orange: "bg-orange-500",
  };
  return (
    <Badge tone={tone} className="capitalize">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[tone])} />
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
