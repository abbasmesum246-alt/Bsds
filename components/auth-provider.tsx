"use client";
import * as React from "react";
import { api } from "@/hooks/use-api";
import type { SafeUser } from "@/lib/types";

interface AuthCtx {
  user: SafeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<SafeUser>;
  register: (d: { name: string; email: string; password: string; company?: string }) => Promise<SafeUser>;
  logout: () => Promise<void>;
  setUser: (u: SafeUser | null) => void;
  refresh: () => Promise<void>;
}
const Ctx = React.createContext<AuthCtx | null>(null);
export function useAuth() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}

export function AuthProvider({ children, initialUser = null }: { children: React.ReactNode; initialUser?: SafeUser | null }) {
  const [user, setUser] = React.useState<SafeUser | null>(initialUser);
  const [loading, setLoading] = React.useState(!initialUser);

  const refresh = React.useCallback(async () => {
    try {
      const res = await api.get<{ user: SafeUser | null }>("/api/auth/me");
      setUser(res.user);
    } catch { setUser(null); }
  }, []);

  React.useEffect(() => {
    if (initialUser) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ user: SafeUser | null }>("/api/auth/me");
        if (!cancelled && res.user) setUser(res.user);
      } catch { /* not signed in */ } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [initialUser]);

  const login = React.useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<{ user: SafeUser }>("/api/auth/login", { email, password });
      setUser(res.user);
      return res.user;
    } finally { setLoading(false); }
  }, []);

  const register = React.useCallback(async (d: { name: string; email: string; password: string; company?: string }) => {
    setLoading(true);
    try {
      const res = await api.post<{ user: SafeUser }>("/api/auth/register", d);
      setUser(res.user);
      return res.user;
    } finally { setLoading(false); }
  }, []);

  const logout = React.useCallback(async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, loading, login, register, logout, setUser, refresh }}>{children}</Ctx.Provider>;
}
