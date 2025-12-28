// =================== FILE: middleware.ts ===================
import { type NextRequest } from 'next/server';
import { updateSession } from '@/adapters/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Aquesta funció actualitza la sessió de Supabase
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Coincideix amb totes les rutes excepte:
     * 1. /api/ (rutes API)
     * 2. /_next/ (arxius interns de Next.js)
     * 3. /static (arxius estàtics)
     * 4. /login i /register (Rutes públiques d'auth) <--- CLAU
     * 5. Arxius amb extensió (imatges, favicon, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};