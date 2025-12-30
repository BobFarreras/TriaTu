import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export class SuggestRecipes {
  constructor(
    private inventoryRepo: InventoryRepository,
    private recipeRepo: RecipeRepository,
    // 🗑️ HEM ELIMINAT userRepo d'aquí. Menys problemes.
    private generator: RecipeGenerator,
    private matcher: RecipeMatcher
  ) {}

  // ✅ NOU PARÀMETRE: restrictions
  async execute(
    userId: string, 
    context: { energy: number; time: number },
    restrictions: DietaryRestriction[] 
  ): Promise<Recipe[]> {
    
    const TOTAL_SUGGESTIONS = 4;
    console.log(`\n🕵️ [USECASE] Analitzant per: ${userId}`);

    // 1. Dades (Només inventari i receptes)
    const [inventoryEntities, savedRecipes] = await Promise.all([
        this.inventoryRepo.findByUser(userId),
        this.recipeRepo.findAllByUser(userId)
    ]);

    // LOGS SIMPLIFICATS
    console.log(`🚫 Restriccions passades directament: ${restrictions.join(', ') || 'Cap'}`);

    const inventoryProps = inventoryEntities.map(i => i.props);
    
    // 2. Filtratge Local
    const validSavedRecipes = savedRecipes.filter((recipe: Recipe) => {
        if (recipe.props.prepTimeMinutes && recipe.props.prepTimeMinutes > context.time) return false;
        if (!recipe.isSafeFor(restrictions)) return false; 
        
        const match = this.matcher.match(recipe, inventoryProps);
        return match.isPossible;
    });

    const finalSuggestions = [...validSavedRecipes].slice(0, TOTAL_SUGGESTIONS);
    
    // 3. Generació IA
    const needed = TOTAL_SUGGESTIONS - finalSuggestions.length;

    if (needed > 0) {
        const existingNames = finalSuggestions.map(r => r.name);
        try {
            const aiRecipes = await this.generator.generate(
                inventoryProps, 
                restrictions, // Passem les que hem rebut per argument
                undefined, 
                existingNames
            );
            
            for (const recipe of aiRecipes) {
                if (finalSuggestions.length < TOTAL_SUGGESTIONS) finalSuggestions.push(recipe);
            }
        } catch (e) {
            console.error(`❌ Error IA:`, e);
        }
    }

    return finalSuggestions;
  }
}