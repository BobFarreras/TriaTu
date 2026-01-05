/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  
  // ✅ IMPLEMENTACIÓ DE HEADERS DE SEGURETAT OWASP
  async headers() {
    return [
      {
        // Apliquem aquestes regles a TOTES les rutes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload' // Força HTTPS durant 2 anys
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Evita que el navegador "endevini" i executi fitxers maliciosos disfressats
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY' // Evita Clickjacking (ningú pot posar la teva web en un iframe)
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block' // Protecció extra per a navegadors antics
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin' // Privacitat: no enviem la URL completa a llocs externs
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' // Bloqueja accés a hardware no utilitzat
          },
          {
            key: 'Content-Security-Policy',
            // Aquesta és la regla més complexa. Llegeix l'explicació a baix.
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.supabase.co https://*.supabase.in;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://*.supabase.in;
            `.replace(/\s{2,}/g, ' ').trim() // Netegem espais en blanc
          }
        ],
      },
    ];
  },
};

export default nextConfig;