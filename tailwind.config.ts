import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc",
          400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca",
          800: "#3730a3", 900: "#312e81", 950: "#1e1b4b",
        },
        teal: {
          50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4",
          400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e",
        },
        ink: {
          50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
          400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155",
          800: "#1e293b", 900: "#0f172a", 950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,.04),0 8px 24px -12px rgba(15,23,42,.12)",
        soft: "0 4px 24px -6px rgba(15,23,42,.08)",
        pop: "0 20px 50px -12px rgba(79,70,229,.28)",
        glow: "0 0 0 1px rgba(99,102,241,.15), 0 12px 36px -8px rgba(99,102,241,.35)",
        "glow-teal": "0 0 0 1px rgba(13,148,136,.15), 0 12px 36px -8px rgba(13,148,136,.35)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,.9)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg,#6366f1 0%,#4f46e5 45%,#0d9488 100%)",
        "brand-radial": "radial-gradient(ellipse at top left, rgba(99,102,241,.18), transparent 55%), radial-gradient(ellipse at bottom right, rgba(13,148,136,.16), transparent 55%)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in-slow": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "gradient-x": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        "pulse-glow": { "0%,100%": { opacity: ".5" }, "50%": { opacity: "1" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-20px) scale(1.08)" },
          "66%": { transform: "translate(-20px,20px) scale(.96)" },
        },
      },
      animation: {
        "fade-in": "fade-in .4s cubic-bezier(.16,1,.3,1) both",
        "fade-in-slow": "fade-in-slow .8s ease both",
        shimmer: "shimmer 2s infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "scale-in": "scale-in .25s cubic-bezier(.16,1,.3,1) both",
        aurora: "aurora 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
