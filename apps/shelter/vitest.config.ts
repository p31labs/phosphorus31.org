import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: false,
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    setupFiles: [path.resolve(__dirname, 'test/setup.ts')],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
