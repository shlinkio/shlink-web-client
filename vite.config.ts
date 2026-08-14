import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { manifest } from './manifest.ts';
import pack from './package.json' with { type: 'json' };

const homepage = pack.homepage?.trim();

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
      strategies: 'injectManifest',
      srcDir: './src',
      filename: 'service-worker.ts',
      injectRegister: false,
      manifestFilename: 'manifest.json',
      manifest,
    }),
  ],

  build: {
    outDir: 'build',
  },

  server: {
    port: 3000,
    watch: {
      // Do not watch test files or generated files, avoiding the dev server to constantly reload when not needed
      ignored: ['**/.idea/**', '**/.git/**', '**/build/**', '**/coverage/**', '**/test/**'],
    },
  },

  base: !homepage ? undefined : homepage, // Not using just homepage because empty string should be discarded

  // Vitest config
  test: {
    // Run tests in an actual browser
    browser: {
      provider: playwright({
        // In CI, this instructs playwright to use a pre-existing Chrome instance
        launchOptions: process.env.CI ? { channel: 'chrome' } : undefined,
      }),
      enabled: true,
      headless: true,
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
    globals: true,
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
        branches: 89, // FIXME Increase to 95 again. It dropped after updating to vitest 4
        functions: 93,
        lines: 95,
      },
    },

    // Silent warnings triggered by reactstrap components, as it's getting removed
    onConsoleLog: (log) => !log.includes('`transition.timeout` is marked as required'),
  },
});
