import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TriaTu',
    short_name: 'TriaTu',
    description: 'Decisions en grup fàcils i ràpides',
    start_url: '/',
    display: 'standalone',
    background_color: '#131f24', // Blau nit (evita pantallades blanques)
    theme_color: '#131f24',      // Barra de navegació
    orientation: 'portrait',
    icons: [
      {
        src: '/web-app-manifest-192x192.png', // Assegura't que la ruta és correcta a public/
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