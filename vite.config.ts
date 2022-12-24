import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        index: './index.html', // default entry point
        'service-worker': './src/service-worker.ts', // service worker
      },
      output: {
        entryFileNames: ({ name }) => (
          name === 'service-worker'
            ? '[name].js' // put service worker in root
            : 'assets/[name]-[hash].js' // others in `assets/js/`
        ),
      },
    },
  },
  server: {
    port: 3000,
  },
});
