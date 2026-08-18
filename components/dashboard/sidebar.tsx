"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Store, Truck, Workflow, Settings, LifeBuoy, X, Sparkles, BarChart3 } from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Finance", href: "/dashboard/finance", icon: BarChart3 },
  { label: "Stores", href: "/dashboard/stores", icon: Store },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
  { label: "Automations", href: "/dashboard/automations", icon: Workflow },
];
const bottom = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help & support", href: "#", icon: LifeBuoy },
];

export function Sidebar({ open, onClose, pendingOrders }: { open: boolean; onClose: () => void; pendingOrders?: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href));

  const content = (
    <div className="flex h-full flex-col bg-white">
      <div className="h-16 flex items-center justify-between px-5 border-b border-ink-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-white font-bold">B</div>
          <div>
            <p className="font-bold text-ink-900 leading-tight">BSDS</p>
            <p className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">Automation Suite</p>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-ink-400">Workspace</p>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition", active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900")}>
              <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-brand-600" : "text-ink-400")} />
              <span className="flex-1">{item.label}</span>
              {item.label === "Orders" && pendingOrders ? <span className="badge bg-amber-100 text-amber-700">{pendingOrders}</span> : null}
            </Link>
          );
        })}
        <div className="pt-6">
          <p className="px-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-ink-400">Account</p>
          {bottom.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.label} href={item.href} onClick={onClose}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition", active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50")}>
                <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-brand-600" : "text-ink-400")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 p-4 text-white">
          <div className="flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4" /><p className="text-sm font-semibold">Upgrade to Business</p></div>
          <p className="text-xs text-brand-100 leading-relaxed">Unlock unlimited products, auto-fulfillment &amp; priority support.</p>
          <button className="mt-3 w-full bg-white/15 hover:bg-white/25 backdrop-blur text-white text-xs font-semibold py-2 rounded-lg">Upgrade plan</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-ink-100 z-30">{content}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-72 shadow-pop animate-fade-in">{content}</div>
        </div>
      )}
    </>
  );
}
