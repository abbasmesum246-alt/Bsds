"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Wordmark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, ShoppingCart, Store, Truck, Workflow,
  Settings, LifeBuoy, X, Sparkles, BarChart3, Calculator, Award,
  Puzzle, Megaphone, Tags, Network, Target, ListChecks, GraduationCap, LogOut, ChevronRight,
} from "lucide-react";

const groups: { title: string; items: { label: string; href: string; icon: typeof LayoutDashboard; badge?: string }[] }[] = [
  { title: "Overview", items: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]},
  { title: "Affiliate", items: [
    { label: "Affiliate Hub", href: "/dashboard/affiliate", icon: Megaphone, badge: "AI" },
    { label: "Offers", href: "/dashboard/offers", icon: Tags },
    { label: "Networks", href: "/dashboard/networks", icon: Network },
    { label: "Campaigns", href: "/dashboard/campaigns", icon: ListChecks },
    { label: "Strategy", href: "/dashboard/strategy", icon: Target, badge: "AI" },
    { label: "Academy", href: "/dashboard/learn", icon: GraduationCap },
  ]},
  { title: "Dropshipping", items: [
    { label: "Products", href: "/dashboard/products", icon: Package },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { label: "Best Suppliers", href: "/dashboard/best-suppliers", icon: Award, badge: "AI" },
    { label: "Stores", href: "/dashboard/stores", icon: Store },
    { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
    { label: "Automations", href: "/dashboard/automations", icon: Workflow },
  ]},
  { title: "Finance", items: [
    { label: "Finance", href: "/dashboard/finance", icon: BarChart3 },
    { label: "Calculator", href: "/dashboard/calculator", icon: Calculator },
  ]},
];

const bottom = [
  { label: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help & support", href: "#", icon: LifeBuoy },
];

function NavItem({ item, active, onClose }: { item: { label: string; href: string; icon: typeof LayoutDashboard; badge?: string }; active: boolean; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} onClick={onClose}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
        active ? "nav-active-dark" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
      )}>
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-violet-400 via-indigo-400 to-cyan-400 shadow-[0_0_14px_rgba(124,58,237,.9)]" />}
      <Icon className={cn("h-[18px] w-[18px] shrink-0 transition", active ? "text-violet-300" : "text-slate-500 group-hover:text-slate-200")} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="text-[8px] font-extrabold tracking-wider bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded px-1 py-0.5 shadow-glow">{item.badge}</span>
      )}
    </Link>
  );
}

export function Sidebar({ open, onClose, pendingOrders }: { open: boolean; onClose: () => void; pendingOrders?: number }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  const content = (
    <div className="relative flex h-full flex-col overflow-hidden text-slate-200"
      style={{ background: "linear-gradient(180deg,#0e1326 0%,#080c1a 100%)" }}>
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 -right-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" />

      {/* Logo */}
      <div className="relative h-16 flex items-center justify-between px-5 border-b border-white/[0.07]">
        <Link href="/dashboard" className="group">
          <Wordmark size={38} dark />
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-500">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={{
                  ...item,
                  label: item.label === "Orders" && pendingOrders ? `${item.label}` : item.label,
                }} active={isActive(item.href)} onClose={onClose} />
              ))}
            </div>
          </div>
        ))}
        <div>
          <p className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-500">System</p>
          <div className="space-y-0.5">
            {bottom.map((item) => (
              <NavItem key={item.label} item={item} active={isActive(item.href)} onClose={onClose} />
            ))}
          </div>
        </div>
      </nav>

      {/* AI Upgrade card */}
      <div className="relative p-3">
        <div className="relative rounded-2xl p-4 text-white overflow-hidden shadow-pop"
          style={{ background: "linear-gradient(135deg,#5b21b6 0%,#4f46e5 50%,#0891b2 100%)" }}>
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 blur-md animate-float" />
          <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-cyan-300/25 blur-lg" />
          <div className="relative flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4" /><p className="text-sm font-extrabold">BSD AI is live</p></div>
          <p className="text-[11px] text-white/85 leading-relaxed relative">Built-in assistant works now. Ask anything or give a command.</p>
          <Link href="/dashboard/strategy" className="mt-3 w-full bg-white/15 hover:bg-white/25 backdrop-blur-md ring-1 ring-white/20 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition">
            Open AI <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Profile */}
      <div className="relative px-3 pb-4">
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition group">
          <div className="h-9 w-9 rounded-full bg-ai-gradient text-white flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-white/10">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{user?.name || "Account"}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || ""}</p>
          </div>
          <button onClick={logout} title="Sign out" className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-30">{content}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-72 shadow-void animate-in">{content}</div>
        </div>
      )}
    </>
  );
}
