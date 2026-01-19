// =================== FILE: next.config.ts ===================
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV !== "production";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: isDev,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  // 1. Configuració d'imatges
  // Mantenim el domini aquí. Encara que usem 'unoptimized={true}' al component,
  // és bona pràctica tenir-lo llistat per si en el futur l'WAF de Bonpreu
  // deixés de bloquejar Vercel i volguéssim tornar a l'optimització automàtica.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.compraonline.bonpreuesclat.cat',
        pathname: '/**',
      },
    ],
  },
  
  // 2. Capçaleres de seguretat
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), interest-cohort=()' }, 
          {
            key: 'Content-Security-Policy',
            // AQUESTA ÉS LA CLAU PER A LA SOLUCIÓ:
            // A l'afegir 'https://www.compraonline.bonpreuesclat.cat' a img-src,
            // permetem que el navegador de l'usuari (Client-Side) descarregui
            // la imatge directament, saltant-se el servidor de Vercel.
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.supabase.co https://*.supabase.in https://www.compraonline.bonpreuesclat.cat;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
};

const finalConfig = isDev ? nextConfig : withPWA(nextConfig);

export default finalConfig;