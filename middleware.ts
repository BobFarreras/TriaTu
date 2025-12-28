// =================== FILE: middleware.ts ===================
import { type NextRequest } from 'next/server';
import { updateSession } from '@/adapters/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Coincideix amb tot EXCEPTE:
     * - api routes
     * - static files
     * - images
     * - favicon, login, register, auth
     * - manifest.webmanifest (NOU!!!) <--- AQUI ESTA LA CLAU
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|login|register|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};