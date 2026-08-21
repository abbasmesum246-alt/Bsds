"use client";
import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Loader2, ArrowRight, Sparkles, ShieldCheck, Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = React.useState("demo@bsds.app");
  const [password, setPassword] = React.useState("password123");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!", "Taking you to your dashboard…");
      // Hard redirect guarantees cookies are set and the new page mounts fresh
      // (fixes the "stuck on login after click" race condition).
      window.location.href = "/dashboard";
    } catch (err) {
      setError((err as Error).message || "Sign in failed");
      setLoading(false);
    }
  }

  function demo() {
    setEmail("demo@bsds.app"); setPassword("password123");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-xl bg-[linear-gradient(135deg,#2547f7,#7c3aed)] flex items-center justify-center text-white font-bold text-lg shadow-[0_8px_24px_-8px_rgba(37,71,247,0.7)]">B</div>
        <span className="font-extrabold text-xl text-gradient">BSDS</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-bold mb-4">
          <Sparkles className="h-3.5 w-3.5" /> Dropshipping + Affiliate, in one place
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Welcome back</h1>
        <p className="text-ink-500 mt-1.5">Sign in to automate your business.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-ink-700">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com" className="h-12 mt-1.5 bg-white" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-ink-700">Password</Label>
            <button type="button" className="text-xs font-semibold text-brand-600 hover:underline">Forgot?</button>
          </div>
          <div className="relative mt-1.5">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="h-12 pr-11 bg-white" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3.5 py-2.5 flex items-start gap-2">
            <span className="font-bold">!</span>{error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="btn-premium w-full h-12 text-base disabled:opacity-70">
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Signing in…</> : <>Sign in <ArrowRight className="h-5 w-5" /></>}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">or</span></div>
      </div>

      <button onClick={demo} className="w-full h-11 rounded-xl border-2 border-ink-200 hover:border-brand-400 hover:bg-brand-50/50 text-sm font-bold text-ink-700 transition flex items-center justify-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" /> Use demo account (one tap)
      </button>

      <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-ink-400">
        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Encrypted</span>
        <span>·</span>
        <span>No credit card needed</span>
        <span>·</span>
        <span>Cancel anytime</span>
      </div>

      <p className="mt-8 text-center text-sm text-ink-500">
        New here?{" "}
        <Link href="/register" className="text-brand-600 font-bold hover:underline">Create a free account</Link>
      </p>
    </div>
  );
}
