import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        phosphor: "#39FF14",
        cyan: "#06B6D4",
        amber: "#F59E0B",
        violet: "#8B5CF6",
        void: "#050508",
        "txt-dim": "#8888a0",
        "txt-muted": "#666680",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
