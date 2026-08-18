"use client";
import * as React from "react";
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";
interface ToastItem { id: string; type: ToastType; title: string; description?: string; }
interface Ctx {
  toast: (t: Omit<ToastItem, "id">) => void;
  success: (title: string, d?: string) => void;
  error: (title: string, d?: string) => void;
  info: (title: string, d?: string) => void;
}
const ToastContext = React.createContext<Ctx | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

const cfg: Record<ToastType, { icon: React.ReactNode; cls: string }> = {
  success: { icon: <CheckCircle2 className="h-5 w-5" />, cls: "ring-emerald-200 text-emerald-500" },
  error: { icon: <XCircle className="h-5 w-5" />, cls: "ring-red-200 text-red-500" },
  warning: { icon: <AlertTriangle className="h-5 w-5" />, cls: "ring-amber-200 text-amber-500" },
  info: { icon: <Info className="h-5 w-5" />, cls: "ring-sky-200 text-sky-500" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const remove = React.useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);
  const value: Ctx = {
    toast,
    success: (title, description) => toast({ type: "success", title, description }),
    error: (title, description) => toast({ type: "error", title, description }),
    info: (title, description) => toast({ type: "info", title, description }),
  };
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const c = cfg[t.type];
          return (
            <div key={t.id} className={cn("animate-fade-in bg-white rounded-xl shadow-pop ring-1 p-3.5 flex items-start gap-3", c.cls)}>
              <span>{c.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">{t.title}</p>
                {t.description && <p className="text-xs text-ink-500 mt-0.5 break-words">{t.description}</p>}
              </div>
              <button onClick={() => remove(t.id)} className="text-ink-400 hover:text-ink-700 p-0.5 -m-0.5 shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
