import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/components/auth-provider";
import { Package, TrendingUp, Zap, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (getCurrentUser()) redirect("/dashboard");
  return (
    <AuthProvider>
      <div className="min-h-screen grid lg:grid-cols-2 bg-white">
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-700 via-brand-600 to-violet-700 text-white overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-bold text-lg">B</div>
              <span className="text-xl font-bold">BSDS</span>
            </div>
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold leading-tight">The automation platform built for serious dropshippers.</h2>
            <p className="mt-4 text-brand-100 text-lg">Import products, auto-fulfill orders, and monitor price &amp; stock across every store — from one dashboard.</p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[[<Zap key="z" className="h-5 w-5" />, "Auto-fulfillment"], [<TrendingUp key="t" className="h-5 w-5" />, "Real-time repricing"], [<ShieldCheck key="s" className="h-5 w-5" />, "Stock monitoring"], [<Package key="p" className="h-5 w-5" />, "100+ suppliers"]].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">{f[0]}</span>{f[1]}
                </div>
              ))}
            </div>
          </div>
          <p className="relative text-sm text-white/70">© {new Date().getFullYear()} BSDS. All rights reserved.</p>
        </div>
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
}
