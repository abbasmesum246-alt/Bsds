import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/components/auth-provider";
import { Aurora } from "@/components/ui/aurora";
import { LogoMark } from "@/components/brand/logo";
import { Package, TrendingUp, Zap, ShieldCheck, Sparkles, Cpu } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (getCurrentUser()) redirect("/dashboard");
  return (
    <AuthProvider>
      <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden" style={{ background: "#070a16" }}>
        {/* Cinematic brand panel */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
          style={{ background: "radial-gradient(120% 90% at 20% 0%, #1a2240 0%, #0c1024 55%, #070a16 100%)" }}>
          <Aurora variant="dark" />
          <div className="absolute inset-0 bg-grid-dark opacity-50" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          <div className="relative flex items-center gap-2.5">
            <LogoMark size={40} />
            <span className="text-xl font-extrabold tracking-tight">BSD<span className="text-cyan-400">.</span></span>
          </div>

          <div className="relative max-w-md">
            <div className="flex items-center gap-4 mb-7">
              <div className="relative">
                <div className="ai-orb h-20 w-20" />
                <div className="absolute inset-0 rounded-full bg-ai-gradient blur-2xl opacity-50" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[11px] font-bold">
                <Cpu className="h-3.5 w-3.5 text-cyan-300" /> AI ONLINE
              </div>
            </div>
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight">
              Your business, run by an <span className="text-gradient-animated">intelligent OS.</span>
            </h2>
            <p className="mt-4 text-slate-300 text-lg leading-relaxed">Import winning products, auto-fulfill orders, and run profitable affiliate campaigns — with an AI that reads your data and takes action.</p>
            <div className="mt-9 grid grid-cols-2 gap-3 stagger">
              {[[<Zap key="z" className="h-5 w-5" />, "Auto-fulfillment"], [<TrendingUp key="t" className="h-5 w-5" />, "AI strategy"], [<ShieldCheck key="s" className="h-5 w-5" />, "Encrypted keys"], [<Package key="p" className="h-5 w-5" />, "100+ suppliers"]].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-200 rounded-xl bg-white/[0.04] ring-1 ring-white/10 px-3 py-2.5 backdrop-blur">
                  <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500/30 to-cyan-500/30 ring-1 ring-white/10 flex items-center justify-center text-cyan-200">{f[0]}</span>{f[1]}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-between text-sm text-slate-400">
            <span>© {new Date().getFullYear()} BSD — Business Scientist Design</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-violet-400" /> No credit card required</span>
          </div>
        </div>

        {/* Form side */}
        <div className="relative flex items-center justify-center p-6 sm:p-12 overflow-hidden" style={{ background: "linear-gradient(180deg,#f4f6fb,#e9edf7)" }}>
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="relative w-full max-w-md">{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
}
