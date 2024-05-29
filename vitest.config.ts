import path from 'path';
import swc from 'unplugin-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite(), tsConfigPaths()],
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
        replacement: path.resolve(__dirname, './src/'),
      },
    ],
  },
});
