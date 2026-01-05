import type { NextConfig } from "next";
// ✅ CORRECCIÓ: Usem import estàndard en lloc de require
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
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
  
  // ✅ IMPLEMENTACIÓ DE HEADERS DE SEGURETAT OWASP
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
          // ⚠️ ALERTA: He eliminat 'camera=()' del Permissions-Policy perquè si volem fer fotos de la nevera, la necessitarem!
          { key: 'Permissions-Policy', value: 'geolocation=(), interest-cohort=()' }, 
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.supabase.co https://*.supabase.in;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://*.supabase.in;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);