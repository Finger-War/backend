import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    environment: 'node',
    setupFiles: 'tests/__unit__/support/unit.ts',
    include: ['tests/__unit__/**/*.spec.{js,ts}'],
    globals: true,
  },
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: './src/',
      },
    ],
  },
});
