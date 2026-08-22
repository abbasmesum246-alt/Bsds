"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle" | "premium";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  premium: "btn-premium !px-4 !py-2",
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-[0_8px_20px_-10px_rgba(79,70,229,.7)] hover:shadow-[0_12px_26px_-10px_rgba(79,70,229,.8)] hover:-translate-y-0.5",
  secondary:
    "bg-white/80 backdrop-blur text-ink-700 border border-ink-200 hover:bg-white hover:border-ink-300 hover:shadow-soft",
  ghost: "text-ink-600 hover:bg-ink-100/80 hover:text-ink-900",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-[0_8px_20px_-10px_rgba(220,38,38,.7)] hover:-translate-y-0.5",
  subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100 ring-1 ring-inset ring-brand-100",
};
const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-5 py-3 text-sm rounded-xl",
  icon: "h-10 w-10 p-0 rounded-xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant], sizes[size], className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
