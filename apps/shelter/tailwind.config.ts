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
        void: "#0a0a0f",
        primary: "#d4d4d4",
        dim: "#6b7280",
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
