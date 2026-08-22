import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/components/auth-provider";
import { Package, TrendingUp, Zap, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (getCurrentUser()) redirect("/dashboard");
  return (
    <AuthProvider>
      <div className="min-h-screen grid lg:grid-cols-2 bg-[#0b1020]">
        <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden" style={{ background: "linear-gradient(140deg,#0a0f2c 0%,#312e81 38%,#4f46e5 62%,#0d9488 100%)" }}>
          {/* animated aurora glows */}
          <div className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-indigo-400/30 blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-40 -left-20 h-[30rem] w-[30rem] rounded-full bg-teal-300/20 blur-3xl animate-aurora" />
          <div className="absolute top-1/3 left-1/2 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl animate-float" />
          {/* dotted grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          {/* top sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20 flex items-center justify-center font-bold text-lg shadow-lg">B</div>
              <span className="text-xl font-extrabold tracking-tight">BSD</span>
            </div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-[11px] font-bold ring-1 ring-white/15 mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Business Scientist Design
            </div>
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight">The command center for <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">serious sellers.</span></h2>
            <p className="mt-4 text-indigo-100/90 text-lg leading-relaxed">Import winning products, auto-fulfill orders, and run profitable affiliate campaigns — all from one premium dashboard.</p>
            <div className="mt-10 grid grid-cols-2 gap-4 stagger">
              {[[<Zap key="z" className="h-5 w-5" />, "Auto-fulfillment"], [<TrendingUp key="t" className="h-5 w-5" />, "AI strategy"], [<ShieldCheck key="s" className="h-5 w-5" />, "Stock monitoring"], [<Package key="p" className="h-5 w-5" />, "100+ suppliers"]].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/15 backdrop-blur flex items-center justify-center">{f[0]}</span>{f[1]}
                </div>
              ))}
            </div>
          </div>
          <p className="relative text-sm text-white/60">© {new Date().getFullYear()} BSD — Business Scientist Design</p>
        </div>
        <div className="relative flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 overflow-hidden">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="relative w-full max-w-md">{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
}
