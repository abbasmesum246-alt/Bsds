"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const Ctx = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">{children}</div>
    </Ctx.Provider>
  );
}

export function DropdownTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const ctx = React.useContext(Ctx)!;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void; "aria-expanded"?: boolean }>, {
      onClick: () => ctx.setOpen(!ctx.open), "aria-expanded": ctx.open,
    });
  }
  return <button onClick={() => ctx.setOpen(!ctx.open)}>{children}</button>;
}

export function DropdownContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(Ctx)!;
  if (!ctx.open) return null;
  return (
    <div className={cn("absolute right-0 z-40 mt-2 min-w-[180px] rounded-xl bg-white shadow-pop ring-1 ring-ink-100 p-1.5 animate-fade-in", className)}>
      {children}
    </div>
  );
}

export function DropdownItem({ children, onClick, danger, icon }: {
  children: React.ReactNode; onClick?: () => void; danger?: boolean; icon?: React.ReactNode;
}) {
  const ctx = React.useContext(Ctx)!;
  return (
    <button onClick={() => { onClick?.(); ctx.setOpen(false); }}
      className={cn("w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left transition",
        danger ? "text-red-600 hover:bg-red-50" : "text-ink-700 hover:bg-ink-50")}>
      {icon && <span className="text-ink-400">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownSeparator() { return <div className="my-1 h-px bg-ink-100" />; }
export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">{children}</div>;
}
