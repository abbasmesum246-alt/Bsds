import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff", 100: "#dae6ff", 200: "#bdd2ff", 300: "#8fb4ff",
          400: "#5a8bff", 500: "#3563ff", 600: "#1d40f5", 700: "#162fe1",
          800: "#1829b6", 900: "#1a2a8f", 950: "#141a57",
        },
        ink: {
          50: "#f6f7f9", 100: "#eceef2", 200: "#d5d9e2", 300: "#b0b8c8",
          400: "#8590a8", 500: "#65718c", 600: "#505a73", 700: "#41495d",
          800: "#383e4f", 900: "#0f1320", 950: "#080a12",
        },
      },
      fontFamily: { sans: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"] },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06),0 1px 3px rgba(16,24,40,.10)",
        soft: "0 4px 16px rgba(16,24,40,.06)",
        pop: "0 12px 32px rgba(16,24,40,.12)",
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
