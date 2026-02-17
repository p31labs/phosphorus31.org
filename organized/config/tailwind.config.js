/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High Contrast, Deep Blues
        'background-dark': '#070a1a', 
        'surface-900': '#10152B',
        'surface-800': '#1C2442',
        'surface-700': '#263054', // Lighter surface for borders
        
        // Neon Accents (The Dopamine Hits)
        'accent-teal': '#2dd4bf', // Primary Action / Safety
        'accent-pink': '#ec4899', // Grounding / Love
        'accent-red': '#f87171',  // Critical
        
        // Text Hierarchy
        'text-light': '#f1f5f9',
        'text-muted': '#94a3b8',
      },
      boxShadow: {
        // The "11/22/44 Glow" - Soft but persistent
        'neon-sm': '0 0 5px rgba(45, 212, 191, 0.4)', 
        'neon-md': '0 0 15px rgba(45, 212, 191, 0.3), 0 0 5px rgba(45, 212, 191, 0.5)', 
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.4)', 
      },
      keyframes: {
        scanline: { // Subtle CRT scanline animation for texture
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'border-glow': { // Neon border pulsation
          '0%, 100%': { borderColor: 'rgba(45, 212, 191, 0.3)' },
          '50%': { borderColor: 'rgba(45, 212, 191, 0.8)' },
        },
        'rose-pulse': {
           '0%, 100%': { transform: 'scale(1)', opacity: '1' },
           '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        }
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'rose-pulse': 'rose-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}