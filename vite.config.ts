import { defineConfig } from 'vite';
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
});
