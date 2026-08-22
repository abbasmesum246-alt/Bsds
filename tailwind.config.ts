import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Electric AI signature
        ai: {
          50: "#f3f0ff", 100: "#e9e2ff", 200: "#d6c9ff", 300: "#b8a1ff",
          400: "#9b78ff", 500: "#7c3aed", 600: "#6d28d9", 700: "#5b21b6",
          800: "#4c1d95", 900: "#2e1065", 950: "#1a0638",
        },
        brand: {
          50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc",
          400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca",
          800: "#3730a3", 900: "#312e81", 950: "#1e1b4b",
        },
        cyan: {
          50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9",
          400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490",
        },
        teal: {
          50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4",
          400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e",
        },
        // Deep "void" surfaces for the futuristic shell
        void: {
          50: "#f3f5fa", 100: "#e7ebf4", 200: "#c7cfdf", 300: "#9aa6c0",
          400: "#6b7a9e", 500: "#4a5778", 600: "#364160", 700: "#262e47",
          800: "#181e33", 850: "#121728", 900: "#0c1020", 950: "#070a16",
        },
        ink: {
          50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
          400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155",
          800: "#1e293b", 900: "#0f172a", 950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,16,32,.04),0 12px 32px -16px rgba(12,16,32,.14)",
        soft: "0 6px 24px -8px rgba(12,16,32,.10)",
        pop: "0 24px 60px -16px rgba(124,58,237,.35)",
        glow: "0 0 0 1px rgba(124,58,237,.18), 0 16px 44px -10px rgba(124,58,237,.45)",
        "glow-cyan": "0 0 0 1px rgba(6,182,212,.2), 0 16px 44px -10px rgba(6,182,212,.45)",
        "glow-soft": "0 8px 30px -10px rgba(99,102,241,.35)",
        "inner-hi": "inset 0 1px 0 0 rgba(255,255,255,.12)",
        "void": "0 20px 60px -20px rgba(2,6,23,.7)",
      },
      backgroundImage: {
        "ai-gradient": "linear-gradient(120deg,#7c3aed 0%,#6366f1 45%,#06b6d4 100%)",
        "ai-gradient-soft": "linear-gradient(120deg,rgba(124,58,237,.12),rgba(99,102,241,.10),rgba(6,182,212,.12))",
        "void-gradient": "linear-gradient(180deg,#0c1020 0%,#070a16 100%)",
        "brand-gradient": "linear-gradient(135deg,#6366f1,#0d9488)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in-slow": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "gradient-x": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "orb-pulse": {
          "0%,100%": { transform: "scale(1)", opacity: ".85" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-30px,30px) scale(.95)" },
        },
        "border-flow": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "ping-slow": { "75%,100%": { transform: "scale(2.2)", opacity: "0" } },
        "glow-pulse": { "0%,100%": { opacity: ".4" }, "50%": { opacity: ".9" } },
        marquee: { to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "fade-in": "fade-in .5s cubic-bezier(.16,1,.3,1) both",
        "fade-in-slow": "fade-in-slow 1s ease both",
        shimmer: "shimmer 2.2s infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        float: "float 6s ease-in-out infinite",
        "orb-pulse": "orb-pulse 4s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        "scale-in": "scale-in .3s cubic-bezier(.16,1,.3,1) both",
        aurora: "aurora 22s ease-in-out infinite",
        "border-flow": "border-flow 5s ease infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0,0,.2,1) infinite",
        "glow-pulse": "glow-pulse 3.5s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
