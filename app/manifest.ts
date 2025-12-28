// =================== FILE: app/manifest.ts ===================
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DecideAI',
    short_name: 'DecideAI',
    description: 'Decisions en grup fàcils i ràpides',
    start_url: '/',
    display: 'standalone',
    background_color: '#131f24', // El teu blau nit (per evitar flash blanc)
    theme_color: '#131f24',      // Coherent amb el fosc
    orientation: 'portrait',
    icons: [
      {
        src: '/web-app-manifest-192x192.png', // Assegura't que tens aquestes imatges a /public
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
  }
}