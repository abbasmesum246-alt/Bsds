"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title, description, icon, action, eyebrow,
}: {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="relative mb-6">
      {/* soft accent glow */}
      <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-teal-500/10 blur-2xl pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
        {icon && (
          <div className="h-12 w-12 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 flex items-center justify-center text-indigo-600 shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">{description}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>
    </div>
  );
}
