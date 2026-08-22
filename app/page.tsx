import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LogoMark } from "@/components/brand/logo";
import { Aurora } from "@/components/ui/aurora";
import {
  Package, Zap, TrendingUp, Store, ArrowRight,
  Check, Sparkles, Megaphone, Brain, Globe, Star, ShieldCheck, Cpu,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  if (getCurrentUser()) redirect("/dashboard");

  const features = [
    { icon: <Package className="h-6 w-6" />, title: "One-click product imports", desc: "Pull best-sellers from AliExpress, CJ and 100+ suppliers into any connected store." },
    { icon: <Zap className="h-6 w-6" />, title: "Automated fulfillment", desc: "New orders fly to suppliers automatically; tracking syncs back without lifting a finger." },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Price & stock monitor", desc: "We watch prices and inventory 24/7 and update your listings the moment things change." },
    { icon: <Store className="h-6 w-6" />, title: "Multi-store dashboard", desc: "Manage Shopify, eBay, Wix, WooCommerce, TikTok Shop and Etsy in one place." },
    { icon: <Megaphone className="h-6 w-6" />, title: "Affiliate command center", desc: "Browse the best offers and rising commission rates, grouped by type with ready strategies." },
    { icon: <Brain className="h-6 w-6" />, title: "AI with real web access", desc: "Ask for serious analysis or give a command — grounded in live data, not guesswork. Works instantly, no key needed." },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-slate-900">
      {/* NAV */}
      <header className="sticky top-0 z-30">
        <div className="absolute inset-0 glass-dark" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={36} />
            <span className="font-extrabold text-lg tracking-tight text-white">BSD<span className="text-cyan-400">.</span></span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="btn-ghost">Sign in</Link>
            <Link href="/register" className="btn-premium !py-2.5 !px-4">Start free <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      {/* HERO — dark futuristic */}
      <section className="relative text-white overflow-hidden" style={{ background: "radial-gradient(120% 90% at 50% 0%, #161c35 0%, #0a0e1e 55%, #060912 100%)" }}>
        <Aurora variant="dark" />
        <div className="absolute inset-0 bg-grid-dark opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-3.5 py-1.5 text-xs font-bold mb-6 text-slate-200">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping-slow" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" /></span>
            AI-native · Dropshipping + Affiliate unified
          </div>

          <div className="flex justify-center mb-7">
            <div className="relative">
              <div className="ai-orb h-20 w-20" />
              <div className="absolute inset-0 rounded-full bg-ai-gradient blur-2xl opacity-50" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.03]">
            Run your business like a{" "}
            <span className="text-gradient-animated">scientist.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The futuristic command center that connects every store, imports winning products, fulfills orders on autopilot, and browses the best affiliate offers — powered by an AI that reads the web.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn-premium text-base !px-7 !py-3.5">
              Start free — no card <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary !bg-white/10 !text-white !border-white/15 hover:!bg-white/15 text-base !px-7 !py-3.5">
              <Globe className="h-4 w-4" /> View live demo
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-500">Demo — <span className="font-mono text-slate-300">demo@bsd.app</span> / <span className="font-mono text-slate-300">password123</span></p>

          {/* Product preview */}
          <div className="mt-16 max-w-5xl mx-auto relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-violet-600/30 via-indigo-500/20 to-cyan-500/30 blur-3xl rounded-[3rem]" />
            <div className="relative rounded-2xl p-1.5" style={{ background: "linear-gradient(120deg,rgba(124,58,237,.6),rgba(6,182,212,.5))" }}>
              <div className="rounded-[14px] bg-[#0b1022] p-3 md:p-5 overflow-hidden shadow-void">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 text-[11px] font-semibold text-slate-500 font-mono">app.bsd.app/dashboard</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left stagger">
                  {[
                    ["Revenue (30d)", "$48,230", "+18.2%", "from-violet-500/20 to-transparent"],
                    ["Orders", "1,284", "+12.4%", "from-indigo-500/20 to-transparent"],
                    ["Net profit", "$14,920", "+22.1%", "from-cyan-500/20 to-transparent"],
                    ["Products", "312", "+4.0%", "from-teal-500/20 to-transparent"],
                  ].map((s) => (
                    <div key={s[0]} className="rounded-xl border border-white/10 bg-gradient-to-b p-4" style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.05), transparent)` }}>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{s[0]}</p>
                      <p className="text-xl md:text-2xl font-extrabold text-white mt-1.5 tabular-nums">{s[1]}</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1 inline-flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{s[2]}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-44 md:h-56 rounded-xl bg-black/30 ring-1 ring-white/10 relative overflow-hidden">
                  <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
                        <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <path d="M0,120 C40,100 70,110 100,80 C140,40 170,70 200,55 C240,35 270,60 310,40 C345,24 370,30 400,18 L400,160 L0,160 Z" fill="url(#heroArea)" />
                    <path d="M0,120 C40,100 70,110 100,80 C140,40 170,70 200,55 C240,35 270,60 310,40 C345,24 370,30 400,18" fill="none" stroke="url(#heroLine)" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 bg-cyan-500/10 ring-1 ring-cyan-400/20 rounded-full px-2 py-0.5"><Cpu className="h-3 w-3" /> LIVE · AI FORECAST</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-500">
            {["Shopify", "eBay", "WooCommerce", "Etsy", "Wix", "TikTok Shop"].map((b) => (
              <span key={b} className="text-sm font-bold tracking-wider uppercase opacity-70">{b}</span>
            ))}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow justify-center mb-3">Everything you need</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-void-900">One platform. Every revenue stream.</h2>
            <p className="mt-4 text-lg text-slate-600">From product research to fulfillment automation and affiliate strategy — an AI-native OS for serious operators.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger">
            {features.map((f) => (
              <div key={f.title} className="card-solid p-6 group">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white flex items-center justify-center mb-4 shadow-glow group-hover:scale-105 transition">
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold text-void-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI BANNER */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-void" style={{ background: "radial-gradient(120% 120% at 0% 0%, #1a2238, #0a0e1e)" }}>
            <Aurora variant="dark" />
            <div className="relative grid md:grid-cols-[auto_1fr] gap-8 items-center">
              <div className="flex md:block justify-center">
                <div className="relative">
                  <div className="ai-orb h-24 w-24" />
                  <div className="absolute inset-0 rounded-full bg-ai-gradient blur-2xl opacity-50" />
                </div>
              </div>
              <div>
                <p className="eyebrow !text-cyan-400 mb-2"><Sparkles className="h-3.5 w-3.5" /> Built-in AI — no setup</p>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Ask anything. Give a command. It gets done.</h3>
                <p className="mt-3 text-slate-300 max-w-2xl">“What’s my profit margin?” · “Show low stock” · “Reprice the vacuum to $99.99” · “Fulfill BSDS-100042” — your AI reads live data and takes action instantly. Add a free key for a web-aware cloud model, or use it as-is forever.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Analyzes your numbers", "Changes prices", "Creates products", "Fulfills orders", "Browses the web"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-xs font-semibold bg-white/10 ring-1 ring-white/10 rounded-full px-3 py-1"><Check className="h-3 w-3 text-cyan-400" />{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center tracking-tight mb-14">Launch in three steps</h2>
          <div className="grid gap-6 md:grid-cols-3 stagger">
            {[
              ["01", "Connect your stores", "Link Shopify, eBay, Wix and more in under a minute — no code required."],
              ["02", "Import winning products", "Browse the catalog or paste a supplier URL; AI prices it for profit instantly."],
              ["03", "Auto-fulfill & scale", "Orders go to suppliers and tracking syncs back automatically while you sleep."],
            ].map((s) => (
              <div key={s[0]} className="card-premium p-7 relative overflow-hidden">
                <span className="text-6xl font-extrabold text-gradient leading-none">{s[0]}</span>
                <h3 className="text-lg font-extrabold mt-3 text-void-900">{s[1]}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{s[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="eyebrow justify-center mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Simple, honest pricing</h2>
            <p className="mt-4 text-lg text-slate-600">Start free. Upgrade the moment you scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {[
              { name: "Starter", price: "$0", features: ["1 store", "100 products", "Manual fulfillment", "Built-in AI", "Community support"] },
              { name: "Business", price: "$39", featured: true, features: ["5 stores", "10,000 products", "Auto-fulfillment", "Price & stock monitor", "Affiliate hub + web AI", "Priority support"] },
              { name: "Enterprise", price: "$129", features: ["Unlimited stores", "Unlimited products", "Dedicated manager", "Custom automations", "24/7 support"] },
            ].map((p) => (
              <div key={p.name}
                className={p.featured
                  ? "relative flex flex-col rounded-2xl p-7 text-white shadow-pop overflow-hidden"
                  : "card-solid p-7 flex flex-col"}
                style={p.featured ? { background: "linear-gradient(140deg,#5b21b6,#4f46e5 50%,#0891b2)" } : undefined}
              >
                {p.featured && (<>
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-xl" />
                  <span className="badge w-fit bg-white/20 text-white ring-1 ring-white/25 mb-3 backdrop-blur relative z-10"><Star className="h-3 w-3 fill-white" /> Most popular</span>
                </>)}
                <h3 className={p.featured ? "text-xl font-extrabold relative z-10" : "text-xl font-extrabold text-void-900"}>{p.name}</h3>
                <p className={p.featured ? "mt-4 text-4xl font-extrabold relative z-10" : "mt-4 text-4xl font-extrabold text-void-900"}>
                  {p.price}<span className={p.featured ? "text-base font-medium text-white/70" : "text-base font-medium text-slate-500"}>/mo</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm flex-1 relative z-10">
                  {p.features.map((f) => (
                    <li key={f} className={p.featured ? "flex gap-2 text-white/90" : "flex gap-2 text-slate-600"}>
                      <Check className={p.featured ? "h-4 w-4 text-cyan-200 mt-0.5 shrink-0" : "h-4 w-4 text-emerald-500 mt-0.5 shrink-0"} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className={p.featured
                    ? "relative z-10 mt-7 block text-center rounded-xl bg-white text-violet-700 py-3 font-bold hover:bg-violet-50 transition"
                    : "mt-7 block text-center rounded-xl bg-void-900 text-white py-3 font-bold hover:bg-void-800 transition"}
                >Get started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center text-white shadow-void" style={{ background: "radial-gradient(120% 140% at 50% 0%, #1e2542, #0a0e1e 70%)" }}>
            <Aurora variant="dark" />
            <div className="relative">
              <div className="flex justify-center mb-5"><div className="ai-orb h-14 w-14" /></div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to run your business like a scientist?</h2>
              <p className="relative mt-3 text-slate-300 text-lg">Join thousands of sellers automating dropshipping and affiliate in one place. AI is ready.</p>
              <Link href="/register" className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white text-violet-700 px-7 py-3.5 font-bold hover:bg-violet-50 transition shadow-lg">
                Start free today <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-slate-200/70 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={24} />
            <span className="font-bold text-void-800">BSD</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="inline-flex items-center gap-1 text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Encrypted & secure</span>
            <Link href="/privacy" className="hover:text-void-900 transition">Privacy</Link>
            <a href="#" className="hover:text-void-900 transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
