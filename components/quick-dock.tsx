"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calculator, Package, ShoppingCart, Tags, Megaphone, Target,
  BarChart3, Plus, X, Sparkles, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  action?: "ai" | "search";
  gradient: string;
}

const TOOLS: Tool[] = [
  { id: "ai", label: "Ask AI", icon: <Sparkles className="h-5 w-5" />, action: "ai", gradient: "from-violet-500 to-fuchsia-500" },
  { id: "search", label: "Search", icon: <Search className="h-5 w-5" />, action: "search", gradient: "from-slate-700 to-slate-900" },
  { id: "calc", label: "Calculator", icon: <Calculator className="h-5 w-5" />, href: "/dashboard/calculator", gradient: "from-blue-500 to-indigo-500" },
  { id: "new-product", label: "Add Product", icon: <Package className="h-5 w-5" />, href: "/dashboard/products?new=1", gradient: "from-emerald-500 to-teal-500" },
  { id: "new-order", label: "New Order", icon: <ShoppingCart className="h-5 w-5" />, href: "/dashboard/orders?new=1", gradient: "from-amber-500 to-orange-500" },
  { id: "offers", label: "Find Offers", icon: <Tags className="h-5 w-5" />, href: "/dashboard/offers", gradient: "from-pink-500 to-rose-500" },
  { id: "affiliate", label: "Affiliate", icon: <Megaphone className="h-5 w-5" />, href: "/dashboard/affiliate", gradient: "from-purple-500 to-indigo-500" },
  { id: "strategy", label: "Strategy", icon: <Target className="h-5 w-5" />, href: "/dashboard/strategy", gradient: "from-cyan-500 to-blue-500" },
  { id: "finance", label: "Finance", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/finance", gradient: "from-green-500 to-emerald-600" },
];

export function QuickDock() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const dragStart = React.useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const movedRef = React.useRef(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("bsds_dock_pos");
      if (saved) { setPos(JSON.parse(saved)); return; }
    } catch { /* ignore */ }
    setPos({ x: window.innerWidth - 84, y: window.innerHeight - 140 });
  }, []);

  React.useEffect(() => {
    if (pos.x > 0) localStorage.setItem("bsds_dock_pos", JSON.stringify(pos));
  }, [pos]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
    movedRef.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) movedRef.current = true;
    setPos({
      x: Math.max(12, Math.min(window.innerWidth - 72, dragStart.current.posX + dx)),
      y: Math.max(12, Math.min(window.innerHeight - 72, dragStart.current.posY + dy)),
    });
  };
  const onPointerUp = () => {
    setPos((p) => ({ x: p.x < window.innerWidth / 2 ? 20 : window.innerWidth - 76, y: p.y }));
    if (!movedRef.current) setOpen((o) => !o);
    dragStart.current = null;
  };

  const activate = (tool: Tool) => {
    setOpen(false);
    if (tool.action === "ai") {
      document.querySelector<HTMLButtonElement>("[data-ai-launcher]")?.click();
    } else if (tool.action === "search") {
      const el = document.querySelector<HTMLInputElement>("input[type='search'], input[placeholder*='earch' i], input[placeholder*='Search' i]");
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (tool.href) {
      if (pathname !== tool.href) router.push(tool.href);
    }
  };

  if (pos.x < 0) return null;

  return (
    <div className="fixed z-[60] select-none" style={{ left: pos.x, top: pos.y }}>
      {/* Dock panel */}
      {open && (
        <div className="absolute bottom-20 right-0 sm:bottom-auto sm:top-0 sm:right-20">
          <div className="relative">
            {/* Backdrop blur circle */}
            <div className="absolute -inset-6 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 rounded-full blur-2xl" />
            <div className="relative grid grid-cols-3 gap-2 p-3 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/70 shadow-2xl w-60">
              {TOOLS.map((tool, i) => (
                <button
                  key={tool.id}
                  onClick={() => activate(tool)}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-slate-50 transition group"
                  style={{ animation: `dock-pop 0.3s ${i * 0.025}s both cubic-bezier(0.34, 1.56, 0.64, 1)` }}
                >
                  <span className={cn("h-12 w-12 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-md group-hover:scale-110 group-active:scale-95 transition", tool.gradient)}>
                    {tool.icon}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main FAB */}
      <div className="relative">
        {!open && <span className="absolute inset-0 rounded-2xl bg-indigo-500/40 animate-ping pointer-events-none" />}
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={cn(
            "relative h-14 w-14 rounded-2xl text-white flex items-center justify-center transition-all touch-none",
            "bg-[linear-gradient(135deg,#4f46e5,#0d9488)]",
            "shadow-[0_12px_32px_-8px_rgba(79,70,229,0.65)]",
            open ? "rotate-45 scale-105" : "hover:scale-105"
          )}
          style={{ touchAction: "none" }}
          aria-label="Quick tools"
        >
          {open ? <Plus className="h-6 w-6" /> : <GripDots />}
        </button>
      </div>

      <style jsx>{`
        @keyframes dock-pop {
          0% { opacity: 0; transform: scale(0.4) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function GripDots() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="2" /><circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" /><circle cx="15" cy="12" r="2" />
      <circle cx="9" cy="18" r="2" /><circle cx="15" cy="18" r="2" />
    </svg>
  );
}
