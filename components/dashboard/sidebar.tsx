"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, ShoppingCart, Store, Truck, Workflow,
  Settings, LifeBuoy, X, Sparkles, BarChart3, Calculator, Award,
  Puzzle, Megaphone, Tags, Network, Target, ListChecks, GraduationCap, LogOut, ChevronRight,
} from "lucide-react";

const groups: { title: string; items: { label: string; href: string; icon: typeof LayoutDashboard; badge?: string }[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Affiliate",
    items: [
      { label: "Affiliate Hub", href: "/dashboard/affiliate", icon: Megaphone, badge: "NEW" },
      { label: "Offers", href: "/dashboard/offers", icon: Tags },
      { label: "Networks", href: "/dashboard/networks", icon: Network },
      { label: "Campaigns", href: "/dashboard/campaigns", icon: ListChecks },
      { label: "Strategy", href: "/dashboard/strategy", icon: Target },
      { label: "Academy", href: "/dashboard/learn", icon: GraduationCap },
    ],
  },
  {
    title: "Dropshipping",
    items: [
      { label: "Products", href: "/dashboard/products", icon: Package },
      { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { label: "Best Suppliers", href: "/dashboard/best-suppliers", icon: Award },
      { label: "Stores", href: "/dashboard/stores", icon: Store },
      { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
      { label: "Automations", href: "/dashboard/automations", icon: Workflow },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Finance", href: "/dashboard/finance", icon: BarChart3 },
      { label: "Calculator", href: "/dashboard/calculator", icon: Calculator },
    ],
  },
];

const bottom = [
  { label: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help & support", href: "#", icon: LifeBuoy },
];

export function Sidebar({ open, onClose, pendingOrders }: { open: boolean; onClose: () => void; pendingOrders?: number }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  const content = (
    <div className="flex h-full flex-col glass border-r border-white/60">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-ink-100/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-[linear-gradient(135deg,#4f46e5,#0d9488)] flex items-center justify-center text-white font-bold shadow-[0_4px_12px_-2px_rgba(29,64,245,0.6)] group-hover:scale-105 transition">B</div>
          <div>
            <p className="font-extrabold text-ink-900 leading-tight">BSDS</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-ink-400 font-bold">Business Suite</p>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.18em] font-extrabold text-ink-400">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all relative",
                      active ? "nav-active text-brand-700" : "text-ink-600 hover:bg-ink-50/80"
                    )}>
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-to-b from-brand-500 to-violet-500" />}
                    <Icon className={cn("h-[18px] w-[18px] shrink-0 transition", active ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600")} />
                    <span className="flex-1">{item.label}</span>
                    {item.label === "Orders" && pendingOrders ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5">{pendingOrders}</span>
                    ) : null}
                    {item.badge ? <span className="text-[9px] font-extrabold bg-gradient-to-r from-brand-600 to-violet-600 text-white rounded-full px-1.5 py-0.5">{item.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <p className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.18em] font-extrabold text-ink-400">System</p>
          <div className="space-y-0.5">
            {bottom.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.label} href={item.href} onClick={onClose}
                  className={cn("group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition", active ? "nav-active text-brand-700" : "text-ink-600 hover:bg-ink-50/80")}>
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600")} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Upgrade card */}
      <div className="p-3">
        <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#4f46e5,#0d9488)" }}>
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />
          <div className="relative flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4" /><p className="text-sm font-bold">Upgrade to Pro</p></div>
          <p className="text-[11px] text-white/80 leading-relaxed relative">Unlimited products, real store sync &amp; priority AI.</p>
          <button className="mt-3 w-full bg-white/15 hover:bg-white/25 backdrop-blur text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
            Upgrade <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink-50 transition group">
          <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#4f46e5,#0d9488)] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-900 truncate">{user?.name || "Account"}</p>
            <p className="text-[11px] text-ink-500 truncate">{user?.email || ""}</p>
          </div>
          <button onClick={logout} title="Sign out" className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition">
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
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-72 shadow-pop animate-in">{content}</div>
        </div>
      )}
    </>
  );
}
