// =================== FILE: tests/adapters/middleware.test.ts ===================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateSession } from '@/adapters/supabase/middleware';
import { NextRequest } from 'next/server';

// 1. Mock de Supabase (Simulem que NO estem loguejats per defecte)
const getUserMock = vi.fn();

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: {
      getUser: getUserMock,
    },
  }),
}));

// Helper per crear requests falses
function createReq(path: string) {
  return new NextRequest(new URL(`http://localhost:3000${path}`));
}

describe('Middleware Auth Logic (updateSession)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Per defecte, simulem usuari ANÒNIM (null)
    getUserMock.mockResolvedValue({ data: { user: null } });
  });

  it('🔴 Hauria de redirigir al Login si un anònim va al Dashboard', async () => {
    const req = createReq('/dashboard');
    const res = await updateSession(req);

    // Si redirigeix, el status és 307 (Temporary Redirect)
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login');
  });

  it('🟢 Hauria de PERMETRE entrar al Login o Register sent anònim', async () => {
    const paths = ['/login', '/register', '/auth/callback'];

    for (const path of paths) {
      const req = createReq(path);
      const res = await updateSession(req);
      
      // Si permet passar, Next retorna 200 (rewrite/next) o headers normals
      // El que segur que NO ha de fer és redirigir al login (307)
      expect(res.status).not.toBe(307); 
    }
  });

  it('🟢 Hauria de PERMETRE entrar a una INVITACIÓ sent anònim', async () => {
    // Aquest era el bug crític anterior
    const req = createReq('/invite/code-123-abc');
    const res = await updateSession(req);

    expect(res.status).not.toBe(307);
  });

  it('🟢 Hauria de redirigir al Dashboard si un usuari LOGUEJAT va al Login', async () => {
    // Simulem usuari Loguejat
    getUserMock.mockResolvedValue({ data: { user: { id: 'uuid-user' } } });

    const req = createReq('/login');
    const res = await updateSession(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/dashboard');
  });
});