import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { SupabaseClient } from '@supabase/supabase-js';

// 1. CREEM EL MOCK (El simulador de Supabase)
const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data: [], error: null }), // Simulem que retorna dades buides
  upsert: vi.fn().mockResolvedValue({ error: null }),
  delete: vi.fn().mockResolvedValue({ error: null }),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
};

const mockClient = {
  from: vi.fn().mockReturnValue(mockQueryBuilder),
} as unknown as SupabaseClient;

describe('SupabaseInventoryRepository (Shared Logic)', () => {
  
  // Abans de cada test, netejem els espies per començar de zero
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find items filtering by roomId context (SHARED MODE)', async () => {
    // ARRANGE
    const repo = new SupabaseInventoryRepository(mockClient);
    const myUserId = 'user-1';
    const myRoomId = 'room-A';

    // ACT
    await repo.findByContext(myUserId, myRoomId);

    // ASSERT
    // Verifiquem que s'ha cridat a .eq('room_id', 'room-A')
    expect(mockClient.from).toHaveBeenCalledWith('inventory_items');
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('room_id', myRoomId);
    
    // Assegurem que NO s'ha buscat per user_id en aquest cas (segons la teva lògica de repo)
    // O si la teva lògica filtra per room_id, ja no hauria de mirar user_id o is(null)
  });

  it('should find items filtering by user ONLY (PERSONAL MODE)', async () => {
    // ARRANGE
    const repo = new SupabaseInventoryRepository(mockClient);
    const myUserId = 'user-1';

    // ACT
    await repo.findByContext(myUserId); // Sense roomId

    // ASSERT
    // Verifiquem que busca per usuari I que room_id sigui NULL
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', myUserId);
    expect(mockQueryBuilder.is).toHaveBeenCalledWith('room_id', null);
  });
});