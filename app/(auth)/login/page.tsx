"use client";
import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Wordmark } from "@/components/brand/logo";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { GithubTutorial, GoogleTutorial } from "@/components/auth/oauth-tutorial";
import { Loader2, ArrowRight, Sparkles, ShieldCheck, Zap, Eye, EyeOff, Mail, PlayCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = React.useState("demo@bsd.app");
  const [password, setPassword] = React.useState("password123");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showEmail, setShowEmail] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);
  const [oauthError, setOauthError] = React.useState<string | null>(null);

  const [demoLoading, setDemoLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!", "Taking you to your dashboard…");
      window.location.href = "/dashboard";
    } catch (err) {
      setError((err as Error).message || "Sign in failed");
      setLoading(false);
    }
  }

  async function startDemo() {
    setDemoLoading(true); setError(null);
    try {
      await login("demo@bsd.app", "password123");
      window.location.href = "/dashboard";
    } catch (err) {
      setError((err as Error).message || "Demo login failed");
      setDemoLoading(false);
    }
  }

  function startOAuth(provider: "github" | "google") {
    setOauthLoading(provider); setOauthError(null);
    // Hit the real OAuth start endpoint
    window.location.href = `/api/auth/oauth/${provider}`;
  }

  // Show message if redirected back with an error (e.g. OAuth not configured)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "oauth-not-configured") {
      setOauthError("OAuth isn't set up yet. Follow the tutorial below to enable it in 2 minutes — or use email/demo.");
      setOauthLoading(null);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="lg:hidden mb-8">
        <Wordmark size={44} />
      </div>

      <div className="mb-7">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-teal-50 text-indigo-700 px-3 py-1 text-xs font-bold mb-4 ring-1 ring-indigo-100">
          <Sparkles className="h-3.5 w-3.5" /> Business Scientist Design
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Sign in to<br />
          <span className="text-gradient">your command center</span>
        </h1>
        <p className="text-slate-500 mt-2">Dropshipping, affiliate & analytics — one platform.</p>
      </div>

      {oauthError && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3.5 py-2.5">{oauthError}</div>
      )}

      <div className="space-y-2.5">
        <button type="button" onClick={() => startOAuth("github")} disabled={!!oauthLoading}
          className="group w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-3 transition relative overflow-hidden disabled:opacity-60">
          {oauthLoading === "github" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GithubMark />}
          Continue with GitHub
          <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        </button>
        <button type="button" onClick={() => startOAuth("google")} disabled={!!oauthLoading}
          className="group w-full h-12 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 transition disabled:opacity-60">
          {oauthLoading === "google" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleMark />}
          Continue with Google
          <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
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
          {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3.5 py-2.5"><strong>!</strong> {error}</div>}
          <button type="submit" disabled={loading} className="btn-premium w-full h-12 text-base">
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Signing in…</> : <>Sign in <ArrowRight className="h-5 w-5" /></>}
          </button>
        </form>
      )}

      <div className="mt-5">
        <button onClick={startDemo} disabled={demoLoading}
          className="btn-premium w-full h-12 text-base disabled:opacity-70">
          {demoLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Entering demo…</> : <><PlayCircle className="h-5 w-5" /> Try the live demo — no sign-up</>}
        </button>
      </div>

      {/* Setup tutorials */}
      <div className="mt-6 space-y-2">
        <GithubTutorial />
        <GoogleTutorial />
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Encrypted</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-500" /> Instant</span>
        <span>·</span>
        <span>No credit card</span>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="text-indigo-600 font-bold hover:underline">Create a free account</Link>
      </p>
    </div>
  );
}

function GithubMark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.21 1.79 1.21 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
  );
}
function GoogleMark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
