import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({ icon, title, description, action, className, compact = false }: {
  icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode;
  className?: string; compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", compact ? "py-10 px-4" : "py-16 px-6", className)}>
      <div className={cn("flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-500 mb-4", compact ? "h-12 w-12" : "h-16 w-16")}>
        {icon}
      </div>
      <h3 className={cn("font-semibold text-ink-900", compact ? "text-sm" : "text-base")}>{title}</h3>
      {description && <p className={cn("text-ink-500 mt-1 max-w-sm", compact ? "text-xs" : "text-sm")}>{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
