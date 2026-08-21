"use client";
import * as React from "react";
import type { AffiliateMode } from "@/lib/affiliate/types";
import { getMode, setMode as persistMode } from "@/lib/affiliate/mode";

interface Ctx {
  mode: AffiliateMode;
  setMode: (m: AffiliateMode) => void;
}
const ModeCtx = React.createContext<Ctx | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<AffiliateMode>("guest");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setModeState(getMode());
    setHydrated(true);
  }, []);

  const value = React.useMemo(() => ({
    mode,
    setMode: (m: AffiliateMode) => { setModeState(m); persistMode(m); },
  }), [mode]);

  if (!hydrated) return <div className="min-h-screen" />;
  return <ModeCtx.Provider value={value}>{children}</ModeCtx.Provider>;
}

export function useAffiliateMode() {
  const ctx = React.useContext(ModeCtx);
  if (!ctx) throw new Error("useAffiliateMode must be inside ModeProvider");
  return ctx;
}
