import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { manifest } from './manifest';
import pack from './package.json' with { type: 'json' };

const DEFAULT_NODE_VERSION = 'v22.10.0';
const nodeVersion = process.version ?? DEFAULT_NODE_VERSION;
const homepage = pack.homepage?.trim();

/* eslint-disable-next-line no-restricted-exports */
export default defineConfig({
  plugins: [react(), VitePWA({
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    strategies: 'injectManifest',
    srcDir: './src',
    filename: 'service-worker.ts',
    injectRegister: false,
    manifestFilename: 'manifest.json',
    manifest,
  })],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  base: !homepage ? undefined : homepage, // Not using just homepage because empty string should be discarded

  // Vitest config
  test: {
    globals: true,
    allowOnly: true,
    environment: 'jsdom',
    setupFiles: './config/test/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'clover'],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/*.{ts,tsx}',
        '!src/reducers/index.ts',
        '!src/**/provideServices.ts',
        '!src/container/*.ts',
        '!src/utils/helpers/sw.ts',
      ],

      // Required code coverage. Lower than this will make the check fail
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 90,
        lines: 95,
      },
    },

    // Workaround for bug in react-router (or vitest module resolution) which causes different react-router versions to
    // be resolved for the main package and dependencies who have a peer dependency in react-router.
    // This ensures always the same version is resolved.
    // See https://github.com/remix-run/react-router/issues/12785 for details
    alias: nodeVersion > DEFAULT_NODE_VERSION
      ? {
        'react-router': resolve(__dirname, 'node_modules/react-router/dist/development/index.mjs'),
      }
      : undefined,
  },
});
