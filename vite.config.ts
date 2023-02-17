import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { manifest } from './manifest';
import pack from './package.json';

const homepage = pack.homepage?.trim();

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

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './config/test/setupTests.ts',
    coverage: {
      provider: 'c8', // TODO Try istanbul
      reporter: ['text', 'text-summary', 'html', 'clover'],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/*.{ts,tsx}',
        '!src/reducers/index.ts',
        '!src/**/provideServices.ts',
        '!src/container/*.ts',
      ],

      // Required code coverage. Lower than this will make the check fail
      statements: 90,
      branches: 80,
      functions: 85,
      lines: 90,
    },
    deps: {
      inline: ['vitest-canvas-mock'],
    },
  },
});
