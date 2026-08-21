"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calculator, Bot, Package, ShoppingCart, Tags, Megaphone, Target,
  BarChart3, Award, Plus, X, GripVertical, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  action?: "ai";
  color: string;
}

const TOOLS: Tool[] = [
  { id: "ai", label: "Ask AI", icon: <Sparkles className="h-5 w-5" />, action: "ai", color: "from-violet-500 to-fuchsia-500" },
  { id: "calc", label: "Calculator", icon: <Calculator className="h-5 w-5" />, href: "/dashboard/calculator", color: "from-blue-500 to-indigo-500" },
  { id: "new-product", label: "Add Product", icon: <Package className="h-5 w-5" />, href: "/dashboard/products", color: "from-emerald-500 to-teal-500" },
  { id: "new-order", label: "New Order", icon: <ShoppingCart className="h-5 w-5" />, href: "/dashboard/orders", color: "from-amber-500 to-orange-500" },
  { id: "offers", label: "Find Offers", icon: <Tags className="h-5 w-5" />, href: "/dashboard/offers", color: "from-pink-500 to-rose-500" },
  { id: "affiliate", label: "Affiliate Hub", icon: <Megaphone className="h-5 w-5" />, href: "/dashboard/affiliate", color: "from-purple-500 to-indigo-500" },
  { id: "strategy", label: "AI Strategy", icon: <Target className="h-5 w-5" />, href: "/dashboard/strategy", color: "from-cyan-500 to-blue-500" },
  { id: "finance", label: "Finance", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/finance", color: "from-green-500 to-emerald-600" },
];

export function QuickDock() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [dragging, setDragging] = React.useState(false);
  const dragStart = React.useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const movedRef = React.useRef(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Initialize position bottom-right
  React.useEffect(() => {
    const w = window.innerWidth;
    setPos({ x: w - 84, y: window.innerHeight - 140 });
  }, []);

  // Persist position
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("bsds_dock_pos");
      if (saved) setPos(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);
  React.useEffect(() => {
    if (pos.x > 0) localStorage.setItem("bsds_dock_pos", JSON.stringify(pos));
  }, [pos]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
    movedRef.current = false;
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) movedRef.current = true;
    const newX = Math.max(8, Math.min(window.innerWidth - 72, dragStart.current.posX + dx));
    const newY = Math.max(8, Math.min(window.innerHeight - 72, dragStart.current.posY + dy));
    setPos({ x: newX, y: newY });
  };
  const onPointerUp = () => {
    setDragging(false);
    // Snap to nearest edge
    setPos((p) => {
      const snapX = p.x < window.innerWidth / 2 ? 16 : window.innerWidth - 72;
      return { x: snapX, y: p.y };
    });
    if (!movedRef.current) {
      setOpen((o) => !o);
    }
    dragStart.current = null;
  };

  const activate = (tool: Tool) => {
    setOpen(false);
    if (tool.action === "ai") {
      // Trigger the AI chat button click (it's a separate floating element)
      const aiBtn = document.querySelector<HTMLButtonElement>("[data-ai-launcher]");
      aiBtn?.click();
    } else if (tool.href) {
      if (pathname === tool.href) return;
      router.push(tool.href);
    }
  };

  if (pos.x < 0) return null;

  return (
    <div className="fixed z-[60] select-none" style={{ left: pos.x, top: pos.y }}>
      {/* Radial menu */}
      {open && (
        <div className="absolute bottom-16 right-0 sm:bottom-auto sm:top-0 sm:right-16">
          <div className="relative h-0 w-0">
            {TOOLS.map((tool, i) => {
              const angle = -135 + (i / (TOOLS.length - 1)) * 135; // spread arc
              const rad = (angle * Math.PI) / 180;
              const radius = 120;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              return (
                <button
                  key={tool.id}
                  onClick={() => activate(tool)}
                  className="absolute flex flex-col items-center gap-1 group"
                  style={{
                    left: x - 28,
                    top: y - 28,
                    animation: `dock-pop 0.25s ${i * 0.03}s both cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  }}
                >
                  <span className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg ring-2 ring-white group-hover:scale-110 transition", tool.color)}>
                    {tool.icon}
                  </span>
                  <span className="text-[10px] font-bold bg-ink-900 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main FAB */}
      <button
        ref={buttonRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "h-14 w-14 rounded-2xl bg-[linear-gradient(135deg,#2547f7,#7c3aed)] text-white flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(37,71,247,0.7)] transition-transform touch-none",
          open ? "rotate-45 scale-105" : "hover:scale-105",
          dragging && "scale-110"
        )}
        style={{ touchAction: "none" }}
        aria-label="Quick tools"
      >
        {open ? <X className="h-6 w-6" /> : <GripVertical className="h-6 w-6" />}
      </button>

      {/* Pulse ring when closed */}
      {!open && (
        <span className="absolute inset-0 rounded-2xl bg-brand-500/30 animate-ping pointer-events-none" />
      )}

      <style jsx>{`
        @keyframes dock-pop {
          0% { opacity: 0; transform: scale(0.3); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
