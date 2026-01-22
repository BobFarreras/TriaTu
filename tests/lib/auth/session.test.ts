import { describe, it, expect, vi, beforeEach } from 'vitest';

const makeUser = () => ({
  id: 'user-1',
  email: 'user@example.com'
});

describe('getCurrentUser', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns null when Supabase has no user', async () => {
    const getUser = vi.fn().mockResolvedValue({
      data: { user: null },
      error: null
    });

    vi.doMock('@/adapters/supabase/server', () => ({
      createClient: async () => ({ auth: { getUser } })
    }));

    const { getCurrentUser } = await import('@/lib/auth/session');
    const result = await getCurrentUser();

    expect(result).toBeNull();
    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it('returns null when Supabase returns an error', async () => {
    const getUser = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'boom' }
    });

    vi.doMock('@/adapters/supabase/server', () => ({
      createClient: async () => ({ auth: { getUser } })
    }));

    const { getCurrentUser } = await import('@/lib/auth/session');
    const result = await getCurrentUser();

    expect(result).toBeNull();
  });

  it('maps id and email from Supabase user', async () => {
    const getUser = vi.fn().mockResolvedValue({
      data: { user: makeUser() },
      error: null
    });

    vi.doMock('@/adapters/supabase/server', () => ({
      createClient: async () => ({ auth: { getUser } })
    }));

    const { getCurrentUser } = await import('@/lib/auth/session');
    const result = await getCurrentUser();

    expect(result).toEqual(makeUser());
  });
});
