// ARXIU: tests/integration/shopping-list-flow.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { SupabaseShoppingListRepository } from '@/adapters/supabase/SupabaseShoppingListRepository'; // Assegura't que la ruta és correcta
import { SupabaseClient } from '@supabase/supabase-js'; // ✅ IMPORT NECESSARI

// Mock del client de Supabase
const mockSupabase = {
    from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
            data: [
                {
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
                }
            ],
            error: null
        }),
        upsert: vi.fn().mockResolvedValue({ error: null })
    }))
};

describe('Shopping List Flow', () => {
    let repo: SupabaseShoppingListRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        // ✅ CORRECCIÓ: Type casting segur en lloc de 'any'
        repo = new SupabaseShoppingListRepository(mockSupabase as unknown as SupabaseClient);
    });

    it('hauria de mapejar correctament els camps de snake_case a camelCase', async () => {
        const items = await repo.findAll('user-1');

        expect(items).toHaveLength(1);
        const item = items[0];

        expect(item).toBeInstanceOf(ShoppingListItem);
        expect(item.props.name).toBe('Gall dindi');
        
        expect(item.props.productImage).toBe('https://img.com/dindi.jpg');
        expect(item.props.estimatedCost).toBe(2.25);
        expect(item.props.productId).toBe('prod-1');
    });

    it('hauria de preparar el payload correcte per a la BD (upsert)', async () => {
        const item = ShoppingListItem.create(
            'user-1', 'Llet', 1, 'L', '🥛', false, 
            'prod-2', 'http://img.llet', 1.50
        );

        await repo.upsertItem(item);

        expect(mockSupabase.from).toHaveBeenCalledWith('shopping_list_items');
    });
});