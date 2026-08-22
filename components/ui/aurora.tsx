import { cn } from "@/lib/utils";

// Decorative animated aurora blobs. Drop into any relative/absolute parent.
export function Aurora({ className, variant = "light" }: { className?: string; variant?: "light" | "dark" }) {
  const blobs =
    variant === "dark"
      ? [
          "bg-[radial-gradient(circle,rgba(124,58,237,.55),transparent_60%)]",
          "bg-[radial-gradient(circle,rgba(6,182,212,.45),transparent_60%)]",
          "bg-[radial-gradient(circle,rgba(99,102,241,.45),transparent_60%)]",
        ]
      : [
          "bg-[radial-gradient(circle,rgba(124,58,237,.28),transparent_60%)]",
          "bg-[radial-gradient(circle,rgba(6,182,212,.22),transparent_60%)]",
          "bg-[radial-gradient(circle,rgba(99,102,241,.22),transparent_60%)]",
        ];
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className={cn("absolute -top-24 -left-20 h-80 w-80 rounded-full blur-3xl animate-aurora", blobs[0])} />
      <div className={cn("absolute top-1/3 -right-24 h-96 w-96 rounded-full blur-3xl animate-float", blobs[1])} style={{ animationDelay: "1.5s" }} />
      <div className={cn("absolute -bottom-32 left-1/3 h-80 w-80 rounded-full blur-3xl animate-aurora", blobs[2])} style={{ animationDelay: "3s" }} />
    </div>
  );
}
