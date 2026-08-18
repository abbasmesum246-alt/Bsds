"use client";
import { cn } from "@/lib/utils";

export function Switch({ checked, onChange, disabled, label }: {
  checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label?: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        checked ? "bg-brand-600" : "bg-ink-200"
      )}>
      <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition", checked ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}
