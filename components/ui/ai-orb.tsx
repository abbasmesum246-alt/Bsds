import { cn } from "@/lib/utils";

export function AiOrb({ size = 36, className, speaking = false }: { size?: number; className?: string; speaking?: boolean }) {
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className={cn("absolute inset-0 rounded-full bg-ai-gradient blur-md", speaking && "animate-glow-pulse")}
        style={{ opacity: 0.55 }}
      />
      <span className="ai-orb absolute inset-0" />
      {speaking && (
        <span className="absolute inset-0 rounded-full ring-2 ring-violet-400/60 animate-ping-slow" />
      )}
    </span>
  );
}
