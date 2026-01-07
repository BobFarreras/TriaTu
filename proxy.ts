// =================== FILE: src/proxy.ts ===================
import { type NextRequest} from 'next/server';
import { updateSession } from '@/adapters/supabase/middleware';

// ⚠️ CANVI CLAU: La funció ara es diu 'proxy'
export async function proxy(request: NextRequest) {
  
  // 1. Refresquem la sessió de Supabase (CRÍTIC)
  // Això gestiona la rotació del refresh token i les cookies.
  // Sense això, la sessió caduca en 1 hora.
  const response = await updateSession(request);

  // 2. Security Headers (Bones pràctiques OWASP)
  // Protegeixen tota l'aplicació d'atacs comuns
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
export const config = {
  matcher: [
    /*
     * Matcher net:
     * Executa el middleware a TOTA l'aplicació EXCEPTE fitxers estàtics.
     * NO excloguis 'login', 'register' o 'invite' aquí. Han de passar pel middleware
     * perquè la sessió es validi correctament.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};