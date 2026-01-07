// =================== FILE: next.config.ts ===================
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// 1. Detectamos el entorno
const isDev = process.env.NODE_ENV !== "production";

// 2. Configuramos el PWA (pero no lo aplicamos todavía)
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: isDev, // Desactivar en dev para que Turbopack funcione
  workboxOptions: {
    disableDevLogs: true,
  },
});

// 3. Tu configuración base de Next.js (con Headers de seguridad y Turbo)
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
   
  },
  
  // HEADERS DE SEGURIDAD OWASP
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
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.supabase.co https://*.supabase.in;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in;
       
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
};

// 4. LÓGICA DE EXPORTACIÓN (LA SOLUCIÓN AL ERROR)
// Si es DEV -> Exportamos la config limpia (Turbopack feliz)
// Si es PROD -> Exportamos la config envuelta en PWA (Webpack feliz)

const finalConfig = isDev ? nextConfig : withPWA(nextConfig);

export default finalConfig;