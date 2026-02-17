/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Genesis Gate color palette
        genesis: {
          primary: '#ffd700',    // Golden ratio gold
          secondary: '#06b6d4',  // Cyan for tech
          accent: '#a855f7',     // Purple for quantum
          success: '#22c55e',
          warning: '#fbbf24',
          error: '#ef4444',
          dark: '#0a0a0f',
          surface: '#18181b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
