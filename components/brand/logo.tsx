import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * BSD premium monogram.
 *
 * Design: An abstract "B" formed by two flowing shapes that meet at a
 * precise center point — representing Business (structure, left) meeting
 * Science + Design (creativity/analysis, right). The negative space forms
 * a subtle diamond/gem shape — value created at the intersection.
 *
 * Gradient: indigo (intelligence/trust) → teal (growth/money).
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
        <linearGradient id="bsdg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="55%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="bsdg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Rounded tile */}
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#bsdg)" />

      {/* Subtle top sheen */}
      <rect x="2" y="2" width="44" height="22" rx="13" fill="white" opacity="0.06" />

      {/* Abstract "B" — two rounded lobes sharing a spine */}
      <g fill="url(#bsdg2)">
        {/* Upper bowl */}
        <path d="M18 12
                 H27.5
                 C30.5 12 32.5 14 32.5 16.8
                 C32.5 19.5 30.5 21.3 28 21.3
                 H18 Z" />
        {/* Lower bowl */}
        <path d="M18 22
                 H29
                 C32.3 22 34.5 24.2 34.5 27.2
                 C34.5 30.3 32.2 32.5 29 32.5
                 H18 Z" />
        {/* Spine */}
        <rect x="15.5" y="11.5" width="3.2" height="21.5" rx="1.6" />
      </g>

      {/* Gem/diamond accent in the negative space (the intersection) */}
      <path d="M23.5 21.3 L25.5 22 L23.5 22.7 L21.5 22 Z" fill="#a7f3d0" opacity="0.9" />
    </svg>
  );
}

export function Wordmark({ size = 36, showTagline = true, className, dark = false }: { size?: number; showTagline?: boolean; className?: string; dark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      <div className="leading-none">
        <p className={cn("font-extrabold text-[15px] tracking-tight flex items-baseline gap-0.5", dark ? "text-white" : "text-slate-900")}>
          BSD<span className={dark ? "text-cyan-400" : "text-violet-600"}>.</span>
        </p>
        {showTagline && (
          <p className={cn("text-[8.5px] uppercase tracking-[0.2em] font-bold mt-1", dark ? "text-slate-400" : "text-slate-400")}>
            Business · Scientist · Design
          </p>
        )}
      </div>
    </div>
  );
}
