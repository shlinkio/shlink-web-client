import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { manifest } from './manifest';
import pack from './package.json';

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
      statements: 95,
      branches: 95,
      functions: 90,
      lines: 95,
    },
  },
});
