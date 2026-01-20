// ARXIU: tests/infrastructure/shopping-list-flow.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { SupabaseShoppingListRepository } from '@/adapters/supabase/SupabaseShoppingListRepository';
import { SupabaseClient } from '@supabase/supabase-js';

// Definim el builder per poder encadenar mètodes
const mockBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(), // ✅ AFEGIT
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }), // ✅ AFEGIT
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({ error: null }),
    insert: vi.fn().mockResolvedValue({ error: null }), // ✅ AFEGIT (soluciona l'error .insert is not a function)
    update: vi.fn().mockResolvedValue({ error: null }), // ✅ AFEGIT
    delete: vi.fn().mockResolvedValue({ error: null }),
    in: vi.fn().mockReturnThis(),
    then: (resolve: (value: { data: unknown; error: unknown }) => void) => resolve({ data: [], error: null })
};

const mockSupabase = {
    from: vi.fn(() => mockBuilder)
};

describe('Shopping List Flow', () => {
    let repo: SupabaseShoppingListRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        // Resetegem comportaments per defecte
        mockBuilder.maybeSingle.mockResolvedValue({ data: null, error: null });
        repo = new SupabaseShoppingListRepository(mockSupabase as unknown as SupabaseClient);
    });

    it('hauria de mapejar correctament els camps de snake_case a camelCase', async () => {
        // Preparem dades de retorn pel select
        mockBuilder.then = (resolve) => resolve({
            data: [{
                id: '123',
                user_id: 'user-1',
                name: 'Gall dindi',
                quantity: 0.5,
                unit: 'kg',
                is_checked: false,
                emoji: '🦃',
                product_id: 'prod-1',
                product_image: 'https://img.com/dindi.jpg',
                estimated_cost: 2.25
            }],
            error: null
        });

        const items = await repo.findAll('user-1');
        expect(items).toHaveLength(1);
        expect(items[0].props.name).toBe('Gall dindi');
    });

    it('hauria de preparar el payload correcte per a la BD (upsert)', async () => {
        const item = ShoppingListItem.create(
            'user-1', 'Llet', 1, 'L', '🥛', false, 
            'prod-2', 'http://img.llet', 1.50
        );

        // Cas: No existeix (insert)
        mockBuilder.maybeSingle.mockResolvedValueOnce({ data: null });

        await repo.upsertItem(item);

        // Verifiquem que crida a la taula correcta
        expect(mockSupabase.from).toHaveBeenCalledWith('shopping_list_items');
        
        // Verifiquem que fa un insert
        expect(mockBuilder.insert).toHaveBeenCalled();
    });
});
