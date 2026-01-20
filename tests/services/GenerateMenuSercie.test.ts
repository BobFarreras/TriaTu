import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerateMenuService } from '@/core/application/services/GenerateMenuService';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';

// --- MOCKS ---

const mockInventoryRepo = {
  findByContext: vi.fn()
};
const mockRecipeRepo = {
  findMatches: vi.fn()
};
const mockGenerator = {
  generate: vi.fn()
};
const mockProfileRepo = {
  getById: vi.fn()
};

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
    tags: ['facil'],
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
      mockInventoryRepo as unknown as InventoryRepository,
      mockRecipeRepo as unknown as RecipeRepository,
      mockGenerator as unknown as RecipeGenerator,
      mockProfileRepo as unknown as UserProfileRepository
    );
  });

  it("FATE: Hauria d'utilitzar les preferencies de l'usuari i ignorar la BD", async () => {
    // 1. Setup: Inventari
    mockInventoryRepo.findByContext.mockResolvedValue([mockInventoryItem]);

    // 2. Setup: Perfil Usuari
    mockProfileRepo.getById.mockResolvedValue({
      restrictions: [],
      foodPreferences: ['italian', 'mexican']
    });

    // 3. Setup: Generador IA
    mockGenerator.generate.mockResolvedValue([mockAiRecipe]);

    // 4. EXECUCIO
    const result = await service.execute(userId, 'FATE', '', 50, 30);

    // 5. ASSERTIONS
    expect(mockRecipeRepo.findMatches).not.toHaveBeenCalled();

    const callArgs = mockGenerator.generate.mock.calls[0][0];
    expect(callArgs.mode).toBe('FATE');
    expect(callArgs.vibe).toMatch(/Estil (italian|mexican)/);

    const finalRecipe = result[0];
    expect(finalRecipe.ingredients[0].linkedProductImage).toBe('http://foto-pollastre.jpg');
  });

  it("CHEF: Hauria d'intentar buscar a la BD primer", async () => {
    // 1. Setup: Perfil sense preferencies
    mockProfileRepo.getById.mockResolvedValue({
      restrictions: [],
      foodPreferences: []
    });

    mockInventoryRepo.findByContext.mockResolvedValue([mockInventoryItem]);

    // Simulem que la BD troba 0 resultats
    mockRecipeRepo.findMatches.mockResolvedValue([]);
    mockGenerator.generate.mockResolvedValue([mockAiRecipe]);

    const result = await service.execute(userId, 'CHEF', '', 50, 30);

    expect(result).toHaveLength(1);
    expect(mockRecipeRepo.findMatches).toHaveBeenCalled();
  });
});

