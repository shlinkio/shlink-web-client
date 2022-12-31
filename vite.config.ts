import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { manifest } from './manifest';
import pack from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), chunkSplitPlugin(), VitePWA({
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
  base: pack.homepage ?? '/',
});
