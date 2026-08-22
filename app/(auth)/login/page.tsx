"use client";
import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Loader2, ArrowRight, Sparkles, ShieldCheck, Zap, Eye, EyeOff, Github, Mail, PlayCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = React.useState("demo@bsds.app");
  const [password, setPassword] = React.useState("password123");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showEmail, setShowEmail] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!", "Taking you to your dashboard…");
      // Hard redirect to ensure cookies are set and the app remounts
      window.location.href = "/dashboard";
    } catch (err) {
      setError((err as Error).message || "Sign in failed");
      setLoading(false);
    }
  }

  function startDemo() {
    setEmail("demo@bsds.app");
    setPassword("password123");
    setTimeout(() => {
      const form = document.getElementById("email-form") as HTMLFormElement | null;
      form?.requestSubmit();
    }, 100);
  }

  function oauth(provider: string) {
    setOauthLoading(provider);
    // In a real production app this redirects to /api/auth/{provider}.
    // We show a clear message so users know what's required.
    setTimeout(() => {
      setOauthLoading(null);
      toast.info(
        `${provider} sign-in requires setup`,
        `Add ${provider} OAuth credentials in Integrations to enable this. Use email or demo below.`
      );
    }, 900);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#0d9488)] flex items-center justify-center text-white font-extrabold text-lg shadow-[0_10px_30px_-8px_rgba(79,70,229,0.7)]">B</div>
        <div>
          <p className="font-extrabold text-xl text-gradient leading-none">BSDS</p>
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-slate-400 mt-0.5">Business Suite</p>
        </div>
      </div>

      <div className="mb-7">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-bold mb-4 ring-1 ring-indigo-100">
          <Sparkles className="h-3.5 w-3.5" /> All-in-one dropshipping & affiliate platform
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sign in</h1>
        <p className="text-slate-500 mt-1.5">Welcome back. Let's grow your business.</p>
      </div>

      {/* Social buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => oauth("GitHub")}
          disabled={!!oauthLoading}
          className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-3 transition disabled:opacity-60"
        >
          {oauthLoading === "GitHub" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Github className="h-5 w-5" />}
          Continue with GitHub
        </button>
        <button
          type="button"
          onClick={() => oauth("Google")}
          disabled={!!oauthLoading}
          className="w-full h-12 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center justify-center gap-3 transition disabled:opacity-60"
        >
          {oauthLoading === "Google" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">or</span></div>
      </div>

      {!showEmail ? (
        <button onClick={() => setShowEmail(true)} className="btn-secondary w-full h-12">
          <Mail className="h-4 w-4" /> Continue with email
        </button>
      ) : (
        <form id="email-form" onSubmit={onSubmit} className="space-y-4 animate-in">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com" className="h-12 mt-1.5" autoFocus />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</button>
            </div>
            <div className="relative mt-1.5">
              <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="h-12 pr-11" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3.5 py-2.5 flex items-start gap-2">
              <span className="font-bold">!</span>{error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-premium w-full h-12 text-base">
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Signing in…</> : <>Sign in <ArrowRight className="h-5 w-5" /></>}
          </button>
        </form>
      )}

      {/* Demo */}
      <div className="mt-5">
        <button onClick={startDemo} className="w-full h-11 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 text-indigo-700 font-bold text-sm flex items-center justify-center gap-2 transition">
          <PlayCircle className="h-4 w-4" /> Try the live demo (no sign-up)
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Encrypted</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-500" /> Instant access</span>
        <span>·</span>
        <span>No credit card</span>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="text-indigo-600 font-bold hover:underline">Create a free account</Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
