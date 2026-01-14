// ARXIU: tests/infrastructure/SupabaseShoppingListRepository.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseShoppingListRepository } from '@/adapters/supabase/SupabaseShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { SupabaseClient } from '@supabase/supabase-js';

// Mocks tipats sense 'any' explícit
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockILike = vi.fn();

// Creem un objecte que compleix parcialment amb SupabaseClient
// Utilitzem 'unknown' com a pont segur, que és acceptat per TypeScript en lloc de 'any'
const mockSupabase = {
  from: vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  })),
} as unknown as SupabaseClient;

describe('SupabaseShoppingListRepository', () => {
  let repository: SupabaseShoppingListRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new SupabaseShoppingListRepository(mockSupabase);
    
    // Setup de la cadena (chaining)
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ ilike: mockILike });
    mockILike.mockReturnValue({ single: mockSingle });
    
    // Defaults
    mockSingle.mockResolvedValue({ data: null, error: null });
    mockUpdate.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    mockInsert.mockResolvedValue({ error: null });
  });

  it('hauria de guardar un item nou correctament (mapping)', async () => {
    const item = ShoppingListItem.create('user-123', 'Pomes', 2, 'kg');
    
    await repository.upsertItem(item);

    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockILike).toHaveBeenCalledWith('name', 'Pomes');
    
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-123',
      name: 'Pomes',
      quantity: 2,
      unit: 'kg',
      is_checked: false,
    });
  });

  it('hauria de sumar quantitat si l\'item ja existeix', async () => {
    const item = ShoppingListItem.create('user-123', 'Pomes', 1, 'kg');

    const existingDbItem = {
      id: 'existing-id-555',
      user_id: 'user-123',
      name: 'Pomes',
      quantity: 5,
      unit: 'kg',
      is_checked: true 
    };

    mockSingle.mockResolvedValue({ data: existingDbItem, error: null });

    await repository.upsertItem(item);

    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        quantity: 6,
        is_checked: false
    }));
  });
});