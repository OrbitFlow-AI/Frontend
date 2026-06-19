// Tailwind CSS theme and content-source configuration.
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0b0f17",
        surface: "#121826",
        border: "#1f2937",
        primary: {
          DEFAULT: "#5b8def",
          foreground: "#f8fafc",
        },
        muted: "#64748b",
        success: "#22c55e",
        warning: "#eab308",
        danger: "#ef4444",
      },
      borderRadius: {
        lg: "0.75rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
