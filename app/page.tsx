import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LogoMark } from "@/components/brand/logo";
import {
  Package, Zap, TrendingUp, Store, ArrowRight,
  Check, Sparkles, Megaphone, Brain, Globe, Star,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  if (getCurrentUser()) redirect("/dashboard");

  const features = [
    { icon: <Package className="h-6 w-6" />, title: "One-click product imports", desc: "Pull best-sellers from AliExpress, CJ Dropshipping and 100+ suppliers straight into any connected store." },
    { icon: <Zap className="h-6 w-6" />, title: "Automated fulfillment", desc: "New orders fly to your supplier automatically; tracking numbers sync back without lifting a finger." },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Price & stock monitor", desc: "We watch supplier prices and inventory 24/7 and update your listings the moment something changes." },
    { icon: <Store className="h-6 w-6" />, title: "Multi-store dashboard", desc: "Manage Shopify, eBay, Wix, WooCommerce, Facebook Marketplace and Etsy in one place." },
    { icon: <Megaphone className="h-6 w-6" />, title: "Affiliate command center", desc: "Browse the best offers and growing commission rates, group by type, and prepare winning strategies." },
    { icon: <Brain className="h-6 w-6" />, title: "AI with real web access", desc: "Ask for serious market analysis and run automations by command — grounded in live data, not guesses." },
  ];

  const stats = [
    ["Revenue (30d)", "$48,230", "+18.2%"],
    ["Orders", "1,284", "+12.4%"],
    ["Net profit", "$14,920", "+22.1%"],
    ["Products", "312", "+4.0%"],
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-30 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={36} />
            <span className="font-extrabold text-lg tracking-tight text-ink-900">BSD<span className="text-indigo-500">.</span></span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-ink-600">
            <a href="#features" className="hover:text-ink-900 transition">Features</a>
            <a href="#how" className="hover:text-ink-900 transition">How it works</a>
            <a href="#pricing" className="hover:text-ink-900 transition">Pricing</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="btn-ghost">Sign in</Link>
            <Link href="/register" className="btn-premium !py-2.5 !px-4">Start free <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="bg-grid absolute inset-0 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-indigo-100 text-indigo-700 px-3.5 py-1.5 text-xs font-bold mb-6 shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Dropshipping + Affiliate, unified by AI
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink-900 max-w-4xl mx-auto leading-[1.04]">
            Run your business like a{" "}
            <span className="text-gradient-animated">scientist.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-600 max-w-2xl mx-auto leading-relaxed">
            BSD connects every store, imports winning products, fulfills orders on autopilot, and browses the best affiliate offers — with an AI that actually reads the web.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn-premium text-base !px-6 !py-3.5">
              Start free — no card <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary text-base !px-6 !py-3.5">
              <Globe className="h-4 w-4" /> View live demo
            </Link>
          </div>
          <p className="mt-5 text-xs text-ink-500">Demo login — <span className="font-mono font-semibold">demo@bsd.app</span> / <span className="font-mono font-semibold">password123</span></p>

          {/* Product preview */}
          <div className="mt-16 max-w-5xl mx-auto relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-teal-500/20 blur-3xl rounded-[3rem] -z-10" />
            <div className="card-premium p-2 md:p-3 shadow-2xl">
              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4 md:p-8 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-semibold text-ink-400">app.bsd.app/dashboard</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-left stagger">
                  {stats.map((s) => (
                    <div key={s[0]} className="card-solid p-4">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-ink-400">{s[0]}</p>
                      <p className="text-xl md:text-2xl font-extrabold mt-1.5 text-ink-900 tabular-nums">{s[1]}</p>
                      <p className="text-xs font-bold text-emerald-600 mt-1 inline-flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{s[2]}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-40 md:h-52 rounded-xl bg-white/60 ring-1 ring-slate-200/70 relative overflow-hidden">
                  <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,120 C40,100 70,110 100,80 C140,40 170,70 200,55 C240,35 270,60 310,40 C345,24 370,30 400,18 L400,160 L0,160 Z" fill="url(#heroArea)" />
                    <path d="M0,120 C40,100 70,110 100,80 C140,40 170,70 200,55 C240,35 270,60 310,40 C345,24 370,30 400,18" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* trust row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-ink-400">
            {["Shopify", "eBay", "WooCommerce", "Etsy", "Wix", "TikTok Shop"].map((b) => (
              <span key={b} className="text-sm font-bold tracking-wide uppercase">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow justify-center mb-3">Everything you need</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink-900">One platform. Every revenue stream.</h2>
            <p className="mt-4 text-lg text-ink-600">From product research to fulfillment automation and affiliate strategy — built for serious operators.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger">
            {features.map((f) => (
              <div key={f.title} className="card-solid p-6 group">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-teal-50 text-indigo-600 ring-1 ring-indigo-100 flex items-center justify-center mb-4 shadow-soft group-hover:scale-105 transition">
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center tracking-tight mb-14">Launch in three steps</h2>
          <div className="grid gap-6 md:grid-cols-3 stagger">
            {[
              ["01", "Connect your stores", "Link Shopify, eBay, Wix and more in under a minute — no code required."],
              ["02", "Import winning products", "Browse the catalog or paste a supplier URL to import instantly with AI pricing."],
              ["03", "Auto-fulfill & scale", "We send orders to suppliers and sync tracking automatically while you sleep."],
            ].map((s) => (
              <div key={s[0]} className="card-premium p-7 relative overflow-hidden">
                <span className="text-6xl font-extrabold text-gradient leading-none">{s[0]}</span>
                <h3 className="text-lg font-extrabold mt-3 text-ink-900">{s[1]}</h3>
                <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">{s[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="eyebrow justify-center mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Simple, honest pricing</h2>
            <p className="mt-4 text-lg text-ink-600">Start free. Upgrade the moment you scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {[
              { name: "Starter", price: "$0", features: ["1 store", "100 products", "Manual fulfillment", "Community support"] },
              { name: "Business", price: "$39", featured: true, features: ["5 stores", "10,000 products", "Auto-fulfillment", "Price & stock monitor", "Affiliate hub + AI", "Priority support"] },
              { name: "Enterprise", price: "$129", features: ["Unlimited stores", "Unlimited products", "Dedicated manager", "Custom automations", "24/7 support"] },
            ].map((p) => (
              <div key={p.name}
                className={p.featured
                  ? "card-premium p-7 relative flex flex-col text-white shadow-pop"
                  : "card-solid p-7 flex flex-col"}
                style={p.featured ? { background: "linear-gradient(150deg,#4f46e5,#0d9488)" } : undefined}
              >
                {p.featured && (
                  <>
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-xl" />
                    <span className="badge w-fit bg-white/20 text-white ring-1 ring-white/25 mb-3 backdrop-blur"><Star className="h-3 w-3 fill-white" /> Most popular</span>
                  </>
                )}
                <h3 className={p.featured ? "text-xl font-extrabold" : "text-xl font-extrabold text-ink-900"}>{p.name}</h3>
                <p className={p.featured ? "mt-4 text-4xl font-extrabold" : "mt-4 text-4xl font-extrabold text-ink-900"}>
                  {p.price}<span className={p.featured ? "text-base font-medium text-white/70" : "text-base font-medium text-ink-500"}>/mo</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={p.featured ? "flex gap-2 text-white/90" : "flex gap-2 text-ink-600"}>
                      <Check className={p.featured ? "h-4 w-4 text-teal-200 mt-0.5 shrink-0" : "h-4 w-4 text-emerald-500 mt-0.5 shrink-0"} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className={p.featured
                    ? "mt-7 block text-center rounded-xl bg-white text-indigo-700 py-3 font-bold hover:bg-indigo-50 transition"
                    : "mt-7 block text-center rounded-xl bg-slate-900 text-white py-3 font-bold hover:bg-slate-800 transition"}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl" style={{ background: "linear-gradient(135deg,#312e81,#4f46e5 45%,#0d9488)" }}>
            <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
            <h2 className="relative text-3xl md:text-4xl font-extrabold tracking-tight">Ready to run your business like a scientist?</h2>
            <p className="relative mt-3 text-indigo-100 text-lg">Join thousands of sellers automating dropshipping and affiliate in one place.</p>
            <Link href="/register" className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 px-6 py-3.5 font-bold hover:bg-indigo-50 transition shadow-lg">
              Start free today <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-ink-100 text-sm text-ink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={24} />
            <span className="font-bold text-ink-700">BSD</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6"><Link href="/privacy" className="hover:text-ink-900 transition">Privacy</Link><a href="#" className="hover:text-ink-900 transition">Terms</a><a href="#" className="hover:text-ink-900 transition">Contact</a></div>
        </div>
      </footer>
    </div>
  );
}
