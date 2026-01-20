import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseShoppingListRepository } from '@/adapters/supabase/SupabaseShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { SupabaseClient } from '@supabase/supabase-js';
type SupabaseResponse = { data: unknown; error: unknown };
// ✅ MOCK BUILDER AVANÇAT
// Aquest objecte simula ser alhora el Builder (per encadenar mètodes)
// i la Promise final (per quan fas 'await').
const mockBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(), // Delete també es pot encadenar

  // 🛠️ CANVI CLAU: update retorna 'this' per permetre encadenar .eq()
  update: vi.fn().mockReturnThis(),

  // Insert sol ser terminal en el teu codi, però si volguessis fer .select() després, també hauria de ser mockReturnThis()
  // Per ara el deixem com a resolved value perquè el teu codi fa .insert({...}) i prou.
  insert: vi.fn().mockResolvedValue({ error: null }),

  // maybeSingle retorna una Promise explícita, així que 'await' farà servir això 
  // en lloc del 'then' genèric de sota quan es cridi aquest mètode.
  maybeSingle: vi.fn(),

  // ✨ MÀGIA: Fem que l'objecte sigui "Thenable".
  // Això fa que si fas `await mockBuilder` (com passa al final de update().eq()),
  // es resolgui a aquest valor per defecte.
  then: (resolve: (value: SupabaseResponse) => void) => resolve({ error: null, data: null })
};

const mockSupabase = {
  from: vi.fn(() => mockBuilder)
};

describe('SupabaseShoppingListRepository', () => {
  let repo: SupabaseShoppingListRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new SupabaseShoppingListRepository(mockSupabase as unknown as SupabaseClient);
  });

  it('hauria de guardar un item nou correctament (mapping)', async () => {
    const item = ShoppingListItem.create('u1', 'Poma', 2, 'ud');

    // Mock: No trobem l'item (retorna null)
    mockBuilder.maybeSingle.mockResolvedValue({ data: null, error: null });

    await repo.upsertItem(item);

    // Verificacions
    expect(mockBuilder.maybeSingle).toHaveBeenCalled(); // S'ha fet la comprovació
    expect(mockBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'u1',
      name: 'Poma',
      quantity: 2
    }));
    expect(mockBuilder.update).not.toHaveBeenCalled();
  });

  it('hauria de sumar quantitat si l\'item ja existeix', async () => {
    const item = ShoppingListItem.create('u1', 'Poma', 3, 'ud');

    // Mock: Sí trobem l'item
    mockBuilder.maybeSingle.mockResolvedValue({
      data: { id: 'existing-id-123', quantity: 5 },
      error: null
    });

    await repo.upsertItem(item);

    // 1. Verifiquem que crida update
    expect(mockBuilder.update).toHaveBeenCalledWith(expect.objectContaining({
      quantity: 8, // 5 + 3
      is_checked: false
    }));

    // 2. Verifiquem que encadena el .eq() correctament
    // Com que update retorna 'this', la crida a .eq passa sobre el mateix mockBuilder
    expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'existing-id-123');

    // 3. No hauria de fer insert
    expect(mockBuilder.insert).not.toHaveBeenCalled();
  });

  it('hauria de filtrar per roomId quan es passa context de sala', async () => {
    const roomId = 'room-123';
    (mockBuilder.then as unknown as (resolve: (value: SupabaseResponse) => void) => void) = (resolve) =>
      resolve({ data: [], error: null });

    await repo.findAll('u1', roomId);

    expect(mockBuilder.eq).toHaveBeenCalledWith('room_id', roomId);
    expect(mockBuilder.eq).not.toHaveBeenCalledWith('user_id', 'u1');
  });

  it('hauria de filtrar per llista personal quan no hi ha roomId', async () => {
    (mockBuilder.then as unknown as (resolve: (value: SupabaseResponse) => void) => void) = (resolve) =>
      resolve({ data: [], error: null });

    await repo.findAll('u1');

    expect(mockBuilder.eq).toHaveBeenCalledWith('user_id', 'u1');
    expect(mockBuilder.is).toHaveBeenCalledWith('room_id', null);
  });
});
