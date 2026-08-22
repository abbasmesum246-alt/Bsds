"use client";
import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Wordmark } from "@/components/brand/logo";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const toast = useToast();
  const [form, setForm] = React.useState({ name: "", email: "", company: "", password: "" });
  const [error, setError] = React.useState<string | null>(null);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      toast.success("Welcome to BSDS!", "Your account is ready.");
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="lg:hidden mb-8 flex justify-center">
        <Wordmark size={48} />
      </div>
      <div className="relative rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/80 p-7 sm:p-9 shadow-[0_30px_80px_-30px_rgba(15,23,42,.35)] animate-scale-in">
        <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-200/40 via-transparent to-teal-200/40 -z-10 blur-xl" />
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Create your account</h1>
      <p className="text-sm text-ink-500 mt-1">Start automating your dropshipping business in minutes.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Alex Morgan" className="h-11" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@store.com" className="h-11" />
        </div>
        <div>
          <Label htmlFor="company">Store / company <span className="text-ink-400 font-normal">(optional)</span></Label>
          <Input id="company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Morgan Commerce Co." className="h-11" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" required minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="At least 6 characters" className="h-11" />
        </div>
        {error && <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>}
        <button type="submit" disabled={loading} className="btn-premium w-full h-11">
          {loading ? "Creating account…" : "Create free account →"}
        </button>
        <p className="text-xs text-ink-400 text-center">By creating an account you agree to our Terms and Privacy Policy.</p>
      </form>
      <p className="mt-8 text-center text-sm text-ink-500">
        Already have an account? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
      </p>
      </div>
    </div>
  );
}
