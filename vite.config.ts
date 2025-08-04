
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'SakoonApp',
        short_name: 'SakoonApp',
        description: 'एक मानसिक शांति और भावनात्मक सपोर्ट ऐप, जहाँ आप सुनने वाले लोगों से बात कर सकते हैं, गुमनाम रूप से। अकेलापन दूर करें और सकून पाएं।',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/assets/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'pwa-192x192.png', // Placeholder, ensure you have these icons in the public folder
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Placeholder, ensure you have these icons in the public folder
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    // No proxy or special defines needed anymore.
  }
});
