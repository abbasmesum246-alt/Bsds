"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: {
  open: boolean; onClose: () => void; title?: React.ReactNode;
  description?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full bg-white rounded-2xl shadow-pop border border-ink-100 max-h-[90vh] flex flex-col", sizes[size])}>
        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-ink-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && <h2 className="text-lg font-semibold text-ink-900">{title}</h2>}
                {description && <p className="text-sm text-ink-500 mt-0.5">{description}</p>}
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 shrink-0" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-ink-100 flex items-center justify-end gap-2 bg-ink-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", loading = false, danger = false }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string;
  message: React.ReactNode; confirmLabel?: string; loading?: boolean; danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm bg-white border border-ink-200 hover:bg-ink-50" onClick={onClose} disabled={loading}>Cancel</button>
        <button
          className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm text-white", danger ? "bg-red-600 hover:bg-red-700" : "bg-violet-600 hover:bg-violet-700")}
          onClick={onConfirm} disabled={loading}
        >
          {loading ? "Working…" : confirmLabel}
        </button>
      </>
    }>
      <p className="text-sm text-ink-600">{message}</p>
    </Modal>
  );
}
