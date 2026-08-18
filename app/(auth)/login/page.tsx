"use client";
import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const toast = useToast();
  const [email, setEmail] = React.useState("demo@bsds.app");
  const [password, setPassword] = React.useState("password123");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      toast.success("Welcome back!", "Signed in successfully.");
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <div>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-white font-bold">B</div>
        <span className="font-bold text-lg">BSDS</span>
      </div>
      <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
      <p className="text-sm text-ink-500 mt-1">Sign in to continue to your dashboard.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@store.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>}
        <Button type="submit" className="w-full" size="lg" loading={loading}>Sign in</Button>
      </form>
      <div className="mt-6 rounded-lg bg-brand-50/70 border border-brand-100 p-3 text-xs text-brand-800">
        <p className="font-semibold mb-0.5">Live demo</p>
        <p>Credentials are pre-filled — just click <strong>Sign in</strong>.</p>
      </div>
      <p className="mt-8 text-center text-sm text-ink-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-600 font-semibold hover:underline">Create one free</Link>
      </p>
    </div>
  );
}
