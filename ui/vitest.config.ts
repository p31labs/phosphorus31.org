import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    pool: 'forks',
    maxWorkers: 1,
    // Exclude integration from default run (use: npm run test:integration); exclude component tests that hit React 18/19 conflict in monorepo (re-enable after unifying React or isolating test env).
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/__tests__/integration/**',
      '**/node-a-you/**/*.test.tsx',
      '**/node-b-them/**/*.test.tsx',
      '**/CognitiveFlow.test.tsx',
      '**/Molecule/P31MoleculeViewer.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/types/**', 'src/**/*.d.ts', 'src/**/*.test.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        statements: 40,
        branches: 35,
        functions: 40,
        lines: 40,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'node18',
  },
});
