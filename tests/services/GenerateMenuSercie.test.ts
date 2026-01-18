import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerateMenuService } from '@/core/services/GenerateMenuService';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';

// --- MOCKS ---

const mockInventoryRepo = {
    findByUser: vi.fn()
};
const mockRecipeRepo = {
    findMatches: vi.fn()
};
const mockGenerator = {
    generate: vi.fn()
};

// Mock de createClient (Supabase)
// ✅ SOLUCIÓ: Definim l'estructura base amb vi.fn() perquè TypeScript sàpiga que són Mocks.
const mockSupabase = {
    from: vi.fn().mockReturnThis() // Retorna 'this' o qualsevol objecte
};

// Interceptem el mòdul real
vi.mock('@/adapters/supabase/server', () => ({
    // ✅ Usem 'as unknown' per saltar-nos la comprovació de tipus estricta de la interfície SupabaseClient
    createClient: () => Promise.resolve(mockSupabase as unknown)
}));

describe('GenerateMenuService', () => {
    let service: GenerateMenuService;

    // --- DADES DE PROVA ---
    const userId = 'user-123';
    const mockInventoryItem = InventoryItem.create({
        id: 'inv-1',
        userId,
        name: 'Pollastre',
        quantity: 1,
        unit: 'kg',
        location: StorageLocation.FRIDGE,
        addedAt: new Date(),
        image: 'http://foto-pollastre.jpg',
        price: 5.50
    });

    const mockAiRecipe = new Recipe({
        id: 'ai-1',
        authorId: 'ai',
        name: 'Pollastre al Forn',
        ingredients: [{
            id: 'inv-1',
            name: 'Pollastre',
            quantity: 1,
            unit: 'kg',
            linkedProductId: 'inv-1',
            linkedProductImage: 'http://foto-pollastre.jpg',
            estimatedCost: 5.50
        }],
        steps: ['Cuinar'],
        tags: ['fàcil'],
        dietaryTags: [],
        prepTimeMinutes: 30,
        createdAt: new Date(),
        likesCount: 0,
        isPublic: false,
        ratingSummary: { average: 0, count: 0, distribution: {} },
        isAiGenerated: true,
        estimatedCost: 5.50
    });

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GenerateMenuService(
            // ✅ Casting segur amb 'unknown' per evitar regles de linter
            mockInventoryRepo as unknown as InventoryRepository,
            mockRecipeRepo as unknown as RecipeRepository,
            mockGenerator as unknown as RecipeGenerator
        );
    });

    it('FATE: Hauria d\'utilitzar les preferències de l\'usuari i ignorar la BD', async () => {
        // 1. Setup: Inventari
        mockInventoryRepo.findByUser.mockResolvedValue([mockInventoryItem]);

        // 2. Setup: Perfil Usuari (Supabase)
        const mockProfileData = {
            food_preferences: ['italian', 'mexican'],
            exclusions: []
        };

        // ✅ SOLUCIÓ DE L'ERROR:
        // En lloc de passar funcions normals () => ({...}), usem vi.fn() o un cast a unknown.
        // Aquí fem un cast a 'unknown' de tot l'objecte de retorn per dir-li a TS: "Confia, això és el que retorna 'from'".
        mockSupabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: mockProfileData })
                })
            })
        } as unknown); 

        // 3. Setup: Generador IA
        mockGenerator.generate.mockResolvedValue([mockAiRecipe]);

        // 4. EXECUCIÓ
        const result = await service.execute(userId, 'FATE', '', 50, 30);

        // 5. ASSERTIONS
        expect(mockRecipeRepo.findMatches).not.toHaveBeenCalled();

        const callArgs = mockGenerator.generate.mock.calls[0][0];
        expect(callArgs.mode).toBe('FATE');
        expect(callArgs.vibe).toMatch(/Estil (italian|mexican)/);

        const finalRecipe = result[0];
        expect(finalRecipe.ingredients[0].linkedProductImage).toBe('http://foto-pollastre.jpg');
    });

    it('CHEF: Hauria d\'intentar buscar a la BD primer', async () => {
        // 1. Setup: Perfil sense preferències
        // Tornem a configurar el mock per aquest test
        mockSupabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { food_preferences: [], exclusions: [] } })
                })
            })
        } as unknown);

        mockInventoryRepo.findByUser.mockResolvedValue([mockInventoryItem]);
        
        // Simulem que la BD troba 0 resultats
        mockRecipeRepo.findMatches.mockResolvedValue([]);
        mockGenerator.generate.mockResolvedValue([mockAiRecipe]);

        const result = await service.execute(userId, 'CHEF', '', 50, 30);
        
        expect(result).toHaveLength(1);
    });
});