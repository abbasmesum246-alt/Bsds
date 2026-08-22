"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard", sub: "Your business at a glance" },
  "/dashboard/affiliate": { title: "Affiliate Hub", sub: "Offers, campaigns & strategy" },
  "/dashboard/offers": { title: "Offer Marketplace", sub: "25+ real affiliate programs" },
  "/dashboard/networks": { title: "Affiliate Networks", sub: "Compare platforms" },
  "/dashboard/campaigns": { title: "Campaigns", sub: "Track every link" },
  "/dashboard/strategy": { title: "AI Strategy", sub: "Generated for your niche" },
  "/dashboard/learn": { title: "Academy", sub: "Learn affiliate marketing" },
  "/dashboard/products": { title: "Products", sub: "Manage your catalog" },
  "/dashboard/orders": { title: "Orders", sub: "Fulfillment & tracking" },
  "/dashboard/finance": { title: "Finance", sub: "Profit & performance" },
  "/dashboard/calculator": { title: "Price Calculator", sub: "Price for real profit" },
  "/dashboard/best-suppliers": { title: "Best Suppliers", sub: "Curated & scored" },
  "/dashboard/stores": { title: "Stores", sub: "Your sales channels" },
  "/dashboard/suppliers": { title: "Suppliers", sub: "Fulfillment partners" },
  "/dashboard/automations": { title: "Automations", sub: "If-this-then-that rules" },
  "/dashboard/integrations": { title: "Integrations", sub: "Connect real services" },
  "/dashboard/settings": { title: "Settings", sub: "Your account" },
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [focused, setFocused] = React.useState(false);

  const meta = React.useMemo(() => {
    const keys = Object.keys(TITLES).sort((a, b) => b.length - a.length);
    const match = keys.find((k) => pathname === k || pathname.startsWith(k + "/"));
    return match ? TITLES[match] : { title: "BSD", sub: "Business Scientist Design" };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 glass border-b border-white/60">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <Link href="/dashboard" className="hover:text-violet-600 transition">BSD</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-slate-500">{meta.title}</span>
          </div>
          <h1 className="text-xl font-extrabold text-void-900 leading-tight truncate tracking-tight">{meta.title}</h1>
        </div>

        {/* Command search */}
        <div className="hidden md:block relative max-w-xs flex-1">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition", focused ? "text-violet-500" : "text-slate-400")} />
          <input
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search or jump to…"
            className={cn(
              "w-full h-10 pl-9 pr-16 rounded-xl bg-white/70 border text-sm transition outline-none",
              focused ? "border-violet-400 ring-4 ring-violet-100/70" : "border-slate-200"
            )}
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">⌘K</kbd>
        </div>

        <div className="flex items-center gap-1.5">
          <Link href="/dashboard/strategy"
            className="hidden sm:flex items-center gap-2 h-9 pl-1.5 pr-3.5 rounded-xl text-white text-xs font-bold relative overflow-hidden shine transition hover:-translate-y-0.5"
            style={{ background: "linear-gradient(120deg,#7c3aed,#6366f1 50%,#06b6d4)", boxShadow: "0 10px 24px -10px rgba(124,58,237,.7)" }}>
            <span className="relative h-6 w-6 rounded-full ai-orb !animate-none" style={{ animationDuration: "6s" }}>
              <span className="absolute inset-1 rounded-full bg-gradient-to-br from-violet-300 to-cyan-300" />
            </span>
            <Sparkles className="h-3.5 w-3.5 -ml-5 relative z-10 text-white" />
            <span className="relative z-10">Ask AI</span>
          </Link>
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 ml-1 rounded-full bg-ai-gradient text-white flex items-center justify-center text-xs font-extrabold ring-2 ring-white shadow-glow-soft">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
