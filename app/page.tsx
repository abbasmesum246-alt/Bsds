import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Package, ShoppingCart, Zap, TrendingUp, Store, BarChart3, ArrowRight, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  if (getCurrentUser()) redirect("/dashboard");
  const features = [
    { icon: <Package className="h-6 w-6" />, title: "One-click product imports", desc: "Import best-sellers from AliExpress, CJ Dropshipping and 100+ suppliers to any connected store." },
    { icon: <Zap className="h-6 w-6" />, title: "Automated fulfillment", desc: "New orders are sent to your supplier automatically; tracking numbers sync back." },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Price & stock monitor", desc: "We watch supplier prices and inventory 24/7 and update your listings instantly." },
    { icon: <Store className="h-6 w-6" />, title: "Multi-store dashboard", desc: "Manage Shopify, eBay, Wix, WooCommerce, Facebook Marketplace and Etsy in one place." },
    { icon: <BarChart3 className="h-6 w-6" />, title: "Profit analytics", desc: "Real-time revenue, margin and conversion tracking show what to scale." },
    { icon: <ShoppingCart className="h-6 w-6" />, title: "Automation rules", desc: "Build if-this-then-that rules for repricing, reordering and low-stock alerts." },
  ];
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-lg text-ink-900">BSDS</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm text-ink-600">
            <a href="#features" className="hover:text-ink-900">Features</a>
            <a href="#how" className="hover:text-ink-900">How it works</a>
            <a href="#pricing" className="hover:text-ink-900">Pricing</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100">Sign in</Link>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700">Start free <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-white -z-10" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-semibold ring-1 ring-brand-200 mb-6">
            <Zap className="h-3.5 w-3.5" /> Lightweight dropshipping automation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink-900 max-w-4xl mx-auto leading-[1.05]">
            Automate your entire dropshipping business —{" "}
            <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">import to delivery.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-600 max-w-2xl mx-auto">
            BSDS connects every store, imports winning products, fulfills orders on autopilot, and monitors price &amp; stock 24/7.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 text-white px-6 py-3 text-base font-semibold hover:bg-brand-700">Start free — no card <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/login" className="inline-flex items-center rounded-lg bg-white border border-ink-200 px-6 py-3 text-base font-semibold text-ink-700 hover:bg-ink-50">View live demo</Link>
          </div>
          <p className="mt-6 text-xs text-ink-500">Demo: <span className="font-mono font-semibold">demo@bsd.app</span> / <span className="font-mono font-semibold">password123</span></p>

          <div className="mt-16 max-w-5xl mx-auto rounded-2xl shadow-pop ring-1 ring-ink-100 bg-white p-2">
            <div className="rounded-xl bg-gradient-to-br from-ink-50 to-white p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {[["Revenue (30d)", "$48,230", "+18.2%"], ["Orders", "1,284", "+12.4%"], ["Net profit", "$14,920", "+22.1%"], ["Products", "312", "+4.0%"]].map((s) => (
                <div key={s[0]} className="card p-4">
                  <p className="text-xs text-ink-500">{s[0]}</p>
                  <p className="text-xl md:text-2xl font-bold mt-1">{s[1]}</p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">{s[2]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 border-t border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything to run a profitable store</h2>
            <p className="mt-4 text-ink-600">From product research to fulfillment automation, built for serious dropshippers.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-soft transition group">
                <div className="h-12 w-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition">{f.icon}</div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20 bg-ink-50 border-y border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Launch in three steps</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[["01", "Connect your stores", "Link Shopify, eBay, Wix and more in under a minute."], ["02", "Import products", "Browse catalog or paste a supplier URL to import instantly."], ["03", "Auto-fulfill orders", "We send orders to suppliers and sync tracking automatically."]].map((s) => (
              <div key={s[0]} className="bg-white rounded-xl p-6 border border-ink-100 shadow-card">
                <span className="text-5xl font-extrabold text-brand-100">{s[0]}</span>
                <h3 className="text-lg font-semibold mt-2">{s[1]}</h3>
                <p className="text-sm text-ink-600 mt-1">{s[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Simple pricing</h2>
          <p className="text-center text-ink-600 mb-12">Start free. Upgrade when you scale.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$0", features: ["1 store", "100 products", "Manual fulfillment", "Community support"] },
              { name: "Business", price: "$39", featured: true, features: ["5 stores", "10,000 products", "Auto-fulfillment", "Price & stock monitor", "Priority support"] },
              { name: "Enterprise", price: "$129", features: ["Unlimited stores", "Unlimited products", "Dedicated manager", "Custom automations", "24/7 support"] },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl p-7 border ${p.featured ? "border-brand-300 ring-2 ring-brand-200 shadow-pop" : "border-ink-100 shadow-card"} bg-white`}>
                {p.featured && <span className="badge bg-brand-600 text-white mb-3">Most popular</span>}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-4 text-4xl font-extrabold">{p.price}<span className="text-base font-medium text-ink-500">/mo</span></p>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (<li key={f} className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />{f}</li>))}
                </ul>
                <Link href="/register" className={p.featured ? "mt-7 block text-center rounded-lg bg-brand-600 text-white py-2.5 font-semibold hover:bg-brand-700" : "mt-7 block text-center rounded-lg bg-white border border-ink-200 py-2.5 font-semibold hover:bg-ink-50"}>Get started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-ink-100 text-sm text-ink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">B</div>
            <span className="font-semibold text-ink-700">BSDS</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6"><Link href="/privacy" className="hover:text-ink-900">Privacy</Link><a href="#" className="hover:text-ink-900">Terms</a><a href="#" className="hover:text-ink-900">Contact</a></div>
        </div>
      </footer>
    </div>
  );
}
