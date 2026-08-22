import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium indigo → teal brand
        brand: {
          50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc",
          400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca",
          800: "#3730a3", 900: "#312e81", 950: "#1e1b4b",
        },
        // Keep ink as slate for compatibility, mapped to slate tones
        ink: {
          50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
          400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155",
          800: "#1e293b", 900: "#0f172a", 950: "#020617",
        },
      },
      fontFamily: { sans: ["system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"] },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,.05),0 8px 24px -12px rgba(15,23,42,.12)",
        soft: "0 4px 16px -4px rgba(15,23,42,.08)",
        pop: "0 16px 40px -12px rgba(79,70,229,.25)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { "fade-in": "fade-in .25s ease-out both", shimmer: "shimmer 1.5s infinite" },
    },
  },
  plugins: [],
};
export default config;
