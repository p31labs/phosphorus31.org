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
          // React vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Three.js vendor chunk (separate from react-three to avoid circular dependency)
          if (id.includes('node_modules/three') && !id.includes('@react-three')) {
            return 'three-core';
          }
          // React Three Fiber chunk
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'react-three';
          }
          // Zustand chunk
          if (id.includes('node_modules/zustand')) {
            return 'zustand';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 200,  // Warn if any chunk > 200KB
    assetsInlineLimit: 4096,     // Inline assets < 4KB
    cssMinify: true,
    reportCompressedSize: true,
  },
  // Base path: /web/ for ESP32 SPIFFS; set VITE_BASE_PATH for static hosts (e.g. /p31/ or /)
  base: process.env.VITE_BASE_PATH ?? '/web/',
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
    },
  },
});
