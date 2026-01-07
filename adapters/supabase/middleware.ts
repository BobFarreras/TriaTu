// =================== FILE: src/adapters/supabase/middleware.ts ===================
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // 1. Creem una resposta inicial
  // Això és necessari perquè Supabase pugui injectar les cookies aquí
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // A. Actualitzem cookies a la REQUEST (perquè els Server Components les vegin)
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          );
          
          // B. Regenerem la resposta amb les noves cookies
          supabaseResponse = NextResponse.next({
            request,
          });
          
          // C. Actualitzem cookies a la RESPONSE (perquè el navegador les guardi)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Refresquem sessió (Això fa la màgia de mantenir l'usuari loguejat)
  const { data: { user } } = await supabase.auth.getUser();

  // 3. PROTECCIÓ DE RUTES
  const path = request.nextUrl.pathname;

  // Definim explícitament on pot anar un usuari SENSE estar loguejat
  const publicPaths = [
    '/login', 
    '/register', 
    '/auth',   // Per callbacks de confirmació d'email
    '/invite', // ✅ IMPRESCINDIBLE per entrar a sales
    '/'        // Landing page
  ];

  // Comprovem si l'usuari està intentant accedir a una ruta pública
  const isAccessingPublicPath = publicPaths.some(publicPath => 
    path.startsWith(publicPath)
  );

  // CAS: Usuari NO loguejat intenta anar a lloc privat -> Redirigir a Login
  if (!user && !isAccessingPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Guardem on volia anar per tornar-hi després
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // CAS: Usuari JA loguejat intenta anar a Login o Register -> Redirigir a Dashboard
  if (user && (path === '/login' || path === '/register')) {
     const url = request.nextUrl.clone();
     url.pathname = '/dashboard'; // O '/rooms'
     return NextResponse.redirect(url);
  }

  return supabaseResponse;
}