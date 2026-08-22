"use client";
import * as React from "react";
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error, reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(1000px 500px at 50% -10%, rgba(79,70,229,0.08), transparent), linear-gradient(180deg,#f8fafc,#eef2f7)" }}>
      <div className="card max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-5"><LogoMark size={56} /></div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-bold mb-3 ring-1 ring-red-200">
          <AlertTriangle className="h-3.5 w-3.5" /> Something went wrong
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">We hit an error</h1>
        <p className="text-sm text-slate-500 mt-2">
          The page failed to load. This is usually temporary — try refreshing. If it keeps happening, clear your cache or sign in again.
        </p>
        {error.digest && (
          <p className="text-[11px] text-slate-400 mt-3 font-mono">Reference: {error.digest}</p>
        )}
        <div className="flex gap-2 mt-6">
          <button onClick={reset} className="btn-premium flex-1 justify-center">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <Link href="/dashboard" className="btn-secondary">
            <Home className="h-4 w-4" />
          </Link>
        </div>
        <Link href="/login" className="block text-xs text-slate-400 mt-4 hover:text-indigo-600">← Back to sign in</Link>
      </div>
    </div>
  );
}
