import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Nûr — Kur\'an Öğren',
        short_name: 'Nûr',
        description: 'Kur\'an okumayı öğren, namaz vakitleri, zikir, Esmaül Hüsna',
        theme_color: '#0f2040',
        background_color: '#f8f5ef',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'tr',
        categories: ['education', 'lifestyle'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ]
      },
      workbox: {
        // Quran JSON dosyalarını precache'e ALMA — çok büyük
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        skipWaiting: true,
        clientsClaim: true,
        globIgnores: ['quran/**'],
        runtimeCaching: [
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60*60*24*365 } }
          },
          // Sure JSON'ları — açıldığında cache'le, sonra offline çalışsın
          {
            urlPattern: /\/quran\/\d+\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-surahs',
              expiration: { maxEntries: 114, maxAgeSeconds: 60*60*24*365 },
            }
          },
          // Kuran audio CDN
          {
            urlPattern: /^https:\/\/cdn\.islamic\.network\/quran\/audio\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'quran-audio', expiration: { maxEntries: 200, maxAgeSeconds: 60*60*24*30 } }
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 600,
  }
})
