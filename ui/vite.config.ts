import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,     // Remove all console.*
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/three') && !id.includes('@react-three')) {
            return 'three-core';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
          if (id.includes('node_modules/tone')) {
            return 'tone';
          }
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'react-three';
          }
          if (id.includes('node_modules/zustand')) {
            return 'zustand';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000, // Three.js/GSAP/Tone produce large chunks; Cloudflare accepts
    assetsInlineLimit: 4096,     // Inline assets < 4KB
    cssMinify: true,
    reportCompressedSize: true,
  },
  // Base path: / for web (Cloudflare Pages, local preview). For ESP32 SPIFFS: VITE_BASE_PATH=/web/
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@p31/config': path.resolve(__dirname, '../god.config.ts'),
      '@p31/shared': path.resolve(__dirname, '../shared/p31.ts'),
      '@p31/game-integration': path.resolve(__dirname, '../packages/game-integration/src/index.ts'),
    },
  },
});
