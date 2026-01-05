// =================== FILE: tests/security/actions.test.ts ===================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addCandidateAction } from '@/app/actions/room-actions';

// UUIDs vàlids
const VALID_UUID_ROOM = '123e4567-e89b-12d3-a456-426614174000';
const VALID_UUID_USER = '987fcdeb-51a2-43c1-9876-543210987654';

// ----------------------------------------------------------------------
// 0. PREPARAR MOCKS (HOISTED)
// ----------------------------------------------------------------------
// Això assegura que les variables existeixen ABANS que s'executin els vi.mock
const mocks = vi.hoisted(() => {
  return {
    addCandidate: vi.fn(),
    checkLimit: vi.fn(),
    logSecurity: vi.fn()
  };
});

// ----------------------------------------------------------------------
// 1. MOCK DEL CONTAINER
// ----------------------------------------------------------------------
vi.mock('@/services/container', () => ({
  container: {
    getCreateDecisionRoom: vi.fn(),
    getJoinDecisionRoom: vi.fn(),
    getMakeGroupDecision: vi.fn(),
    getRemoveParticipant: vi.fn(),
    getClearRoomHistory: vi.fn(),
  }
}));

// ----------------------------------------------------------------------
// 2. MOCK DEL CLIENT SUPABASE
// ----------------------------------------------------------------------
vi.mock('@/adapters/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: { id: VALID_UUID_USER } }
      })
    }
  })
}));

// ----------------------------------------------------------------------
// 3. MOCK DEL REPOSITORI (Usant Class Syntax per suportar 'new')
// ----------------------------------------------------------------------
vi.mock('@/adapters/supabase/SupabaseCandidateRepository', () => {
  return {
    SupabaseCandidateRepository: class {
      add = mocks.addCandidate;
    }
  };
});

// ----------------------------------------------------------------------
// 4. MOCK DE SEGURETAT (Usant Class Syntax per suportar 'new')
// ----------------------------------------------------------------------
vi.mock('@/adapters/supabase/SupabaseRateLimiter', () => {
  return {
    SupabaseRateLimiter: class {
      check = mocks.checkLimit;
    }
  };
});

vi.mock('@/adapters/supabase/SupabaseSecurityLogger', () => {
  return {
    SupabaseSecurityLogger: class {
      log = mocks.logSecurity;
    }
  };
});

// ----------------------------------------------------------------------
// TESTS
// ----------------------------------------------------------------------
describe('🚨 SECURITY: Server Actions Flow', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('HAPPY PATH: Hauria de permetre afegir si tot és correcte', async () => {
    // El Rate Limiter diu que SÍ (true)
    mocks.checkLimit.mockResolvedValue(true); 

    const result = await addCandidateAction(VALID_UUID_ROOM, 'Opció vàlida');

    expect(result.success).toBe(true);
    expect(mocks.addCandidate).toHaveBeenCalled(); 
    expect(mocks.logSecurity).not.toHaveBeenCalled();
  });

  it('RATE LIMIT: Hauria de bloquejar i loguejar si vas massa ràpid', async () => {
    // El Rate Limiter diu que NO (false)
    mocks.checkLimit.mockResolvedValue(false);

    const result = await addCandidateAction(VALID_UUID_ROOM, 'Spam spam spam');

    expect(result.success).toBe(false);
    expect(result.error).toContain('massa ràpid');
    
    expect(mocks.addCandidate).not.toHaveBeenCalled(); // DB protegida
    
    // Verifiquem que el logger s'ha cridat
    expect(mocks.logSecurity).toHaveBeenCalledWith(
        'WARN', 
        'RATE_LIMIT_BREACH', 
        VALID_UUID_USER, 
        expect.anything()
    );
  });

  it('XSS ATTACK: Hauria de rebutjar sense cridar al Rate Limiter ni DB', async () => {
    const result = await addCandidateAction(VALID_UUID_ROOM, '<script>alert()</script>');

    expect(result.success).toBe(false);
    expect(result.error).toContain('No es permeten els caràcters'); 

    expect(mocks.checkLimit).not.toHaveBeenCalled();
    expect(mocks.addCandidate).not.toHaveBeenCalled();
  });
});