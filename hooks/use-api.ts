"use client";

import * as React from "react";

async function http<T>(url: string, options?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, headers, ...rest } = options ?? {};
  const res = await fetch(url, {
    ...rest,
    headers: { ...(json ? { "Content-Type": "application/json" } : {}), ...headers },
    body: json ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  get: <T,>(url: string) => http<T>(url),
  post: <T,>(url: string, body?: unknown) => http<T>(url, { method: "POST", json: body }),
  patch: <T,>(url: string, body?: unknown) => http<T>(url, { method: "PATCH", json: body }),
  put: <T,>(url: string, body?: unknown) => http<T>(url, { method: "PUT", json: body }),
  del: <T,>(url: string) => http<T>(url, { method: "DELETE" }),
};

export function useQuery<T>(url: string | null, deps: unknown[] = []) {
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const mounted = React.useRef(true);

  const reload = React.useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<T>(url);
      if (mounted.current) setData(res);
    } catch (e) {
      if (mounted.current) setError((e as Error).message);
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  React.useEffect(() => {
    mounted.current = true;
    reload();
    return () => { mounted.current = false; };
  }, [reload]);

  return { data, loading, error, reload, setData };
}
