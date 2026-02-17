import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/** Run only integration tests (Scope ↔ Buffer, etc.). Use when Shelter is up or with mocks. */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    pool: 'forks',
    maxWorkers: 1,
    include: ['src/__tests__/integration/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  esbuild: { target: 'node18' },
});
