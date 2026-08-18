import { cn, initials } from "@/lib/utils";

export function Avatar({ name, color, size = 36, className }: { name: string; color: string; size?: number; className?: string }) {
  return (
    <div className={cn("inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 select-none", className)}
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.38 }}>
      {initials(name)}
    </div>
  );
}
