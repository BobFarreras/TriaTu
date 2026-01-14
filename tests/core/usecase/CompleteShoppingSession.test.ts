// ARXIU: tests/core/usecases/shopping-list/CompleteShoppingSession.test.ts
import { describe, it, expect, vi } from 'vitest';
import { CompleteShoppingSession } from '@/core/usecases/shopping-list/CompleteShoppingSession';
import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem'; // ✅ 1. Importem l'entitat

describe('CompleteShoppingSession Use Case', () => {
    it('hauria de moure els items checkejats a l\'inventari i esborrar-los de la llista', async () => {
        // Mocks tipats (sense 'any')
        const mockShoppingRepo = {
            findAll: vi.fn().mockResolvedValue([
                // Item 1: Marcat (S'ha de moure)
                { props: { id: '1', name: 'Pomes', quantity: 2, unit: 'kg', isChecked: true } },
                // Item 2: No marcat (S'ha de quedar)
                { props: { id: '2', name: 'Aigua', quantity: 6, unit: 'l', isChecked: false } },
            ]),
            deleteMany: vi.fn().mockResolvedValue(undefined),
        } as unknown as ShoppingListRepository; 
        
        const mockInventoryRepo = {
            saveBatch: vi.fn().mockResolvedValue(undefined),
        } as unknown as InventoryRepository;

        const useCase = new CompleteShoppingSession(mockShoppingRepo, mockInventoryRepo);
        
        // EXECUCIÓ
        const result = await useCase.execute('user-1');

        // VERIFICACIÓ
        // 1. Només s'ha d'haver guardat 1 item a l'inventari (les pomes)
        expect(mockInventoryRepo.saveBatch).toHaveBeenCalledTimes(1);
        
        // Comprovem els arguments de la crida de manera tipada
        const saveCalls = (mockInventoryRepo.saveBatch as ReturnType<typeof vi.fn>).mock.calls;
        
        // ✅ 2. FIX: Casting real cap al tipus esperat en lloc de 'any[]'
        const savedItems = saveCalls[0][0] as InventoryItem[]; 
        
        expect(savedItems).toHaveLength(1);
        // Ara TypeScript sap que 'savedItems[0]' és un InventoryItem i té 'props'
        expect(savedItems[0].props.name).toBe('Pomes');

        // 2. Només s'ha d'haver esborrat 1 item de la llista (les pomes)
        expect(mockShoppingRepo.deleteMany).toHaveBeenCalledWith(['1']);
        
        // 3. Resultat
        expect(result.added).toBe(1);
    });
});