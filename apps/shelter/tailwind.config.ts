import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        phosphor: "#39FF14",
        calcium: "#ff9f43",
        signal: "#00d4ff",
        void: { DEFAULT: "#0a0a0f", 1: "#111118", 2: "#1a1a24" },
        primary: "#d4d4d4",
        dim: "#6b7280",
        cyan: "#06B6D4",
        violet: "#8B5CF6",
        amber: "#F59E0B",
        rose: "#F43F5E",
        txt: { DEFAULT: "#e8e8f0", dim: "#8888a0", muted: "#55556a" },
        "gate-green": "#22c55e",
        "gate-yellow": "#eab308",
        "gate-red": "#ef4444",
        "gate-critical": "#7c3aed",
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "'JetBrains Mono'", "'SF Mono'", "'Cascadia Code'", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
