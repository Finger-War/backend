import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

import tsConfigPaths from 'vite-tsconfig-paths';
import path from 'path';

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
