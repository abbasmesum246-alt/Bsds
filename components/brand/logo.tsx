import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * BSD monogram logo.
 *
 * Meaning:
 *  - The outer rounded square = a "system" / framework (Business)
 *  - The angled cut through the middle = Analytics / Science (a chart line rising)
 *  - The two interlocking shapes below = Design (craft & structure)
 *  - Indigo (trust/intelligence) fading into Teal (growth/money)
 *  - The negative-space gap forms an upward arrow — growth by design
 */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="BSD logo"
      role="img"
    >
      <defs>
        <linearGradient id="bsdg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="55%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="bsdg2" x1="24" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>

      {/* Rounded system square */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#bsdg)" />

      {/* Upward chart/arrow in negative space (Science + growth) */}
      <path
        d="M11 34 L20 25 L26 30 L37 17"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />
      <circle cx="37" cy="17" r="2.6" fill="white" />

      {/* BSD letterform — subtle in the lower band (Design) */}
      <text
        x="24"
        y="42"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontSize="7.5"
        fontWeight="800"
        letterSpacing="1.2"
        fill="white"
        opacity="0.92"
      >
        BSD
      </text>
    </svg>
  );
}

/** Full wordmark: logo mark + "BUSINESS SCIENTIST DESIGN" */
export function Wordmark({ size = 36, showTagline = true, className }: { size?: number; showTagline?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      <div className="leading-none">
        <p className="font-extrabold text-ink-900 text-[15px] tracking-tight">
          BSD<span className="text-indigo-600">.</span>
        </p>
        {showTagline && (
          <p className="text-[8.5px] uppercase tracking-[0.22em] font-bold text-slate-400 mt-0.5">
            Business · Scientist · Design
          </p>
        )}
      </div>
    </div>
  );
}
