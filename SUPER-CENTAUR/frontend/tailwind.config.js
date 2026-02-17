/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Colors (New System)
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        sidebar: 'var(--bg-sidebar)',
        main: 'var(--text-main)',
        muted: 'var(--text-muted)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        border: 'var(--border)',

        // Legacy Compatibility
        'quantum-blue': 'var(--primary)',
        'neural-purple': 'var(--secondary)',
        'love-pink': 'var(--accent)',
        'zen-green': 'var(--success)',
        'void-black': 'var(--bg-page)',
        'phoenix-gold': 'var(--warning)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'quantum-pulse': 'quantum-pulse 2s ease-in-out infinite',
        'wonky-bounce': 'wonky-bounce 3s infinite',
      },
      keyframes: {
        'quantum-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'wonky-bounce': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(1deg)' },
          '75%': { transform: 'translateY(5px) rotate(-1deg)' },
        }
      },
    },
  },
  plugins: [],
}
