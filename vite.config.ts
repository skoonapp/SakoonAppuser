
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'service-worker': './service-worker.js',
      },
      output: {
        entryFileNames: chunkInfo => {
          if (chunkInfo.name === 'service-worker') {
            return '[name].js'; // Keep the service worker name as service-worker.js
          }
          return 'assets/[name]-[hash].js'; // Normal assets
        }
      }
    },
  },
  server: {
    // No proxy or special defines needed anymore.
  }
});
