import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';
import { Recipe } from '@/core/domain/entities/Recipe';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export class SuggestRecipes {
  constructor(
    private inventoryRepo: InventoryRepository,
    private recipeRepo: RecipeRepository,
    private generator: RecipeGenerator,
    private matcher: RecipeMatcher
  ) {}

  async execute(
    userId: string, 
    context: { energy: number; time: number },
    restrictions: DietaryRestriction[] 
  ): Promise<Recipe[]> {
    
    const TOTAL_SUGGESTIONS = 4;
    console.log(`\n🕵️ [USECASE] Iniciant anàlisi per usuari: ${userId}`);

    // 1. Dades
    const [inventoryEntities, savedRecipes] = await Promise.all([
        this.inventoryRepo.findByUser(userId),
        this.recipeRepo.findAllByUser(userId)
    ]);

    // ---- LOGS DE DEBUGGING (STRICT MODE) ----
    console.log(`📊 Inventari trobat: ${inventoryEntities.length} items`);
    console.log(`📚 Receptes guardades trobades: ${savedRecipes.length}`);
    
    if (savedRecipes.length > 0) {
        const firstRecipe = savedRecipes[0];
        
        // Comprovació de tipus segura sense 'any'
        const isInstance = firstRecipe instanceof Recipe;
        
        // Casting segur a un objecte indexable per comprovar la propietat dinàmicament
        const recipeAsGeneric = firstRecipe as unknown as Record<string, unknown>;
        const hasMethod = typeof recipeAsGeneric['isSafeFor'] === 'function';
        
        console.log(`🧐 DEBUG RECEPTA: Instancia=${isInstance}, Mètode isSafeFor=${hasMethod}`);
        
        // Inspecció addicional segura
        if (!isInstance) {
             console.warn("⚠️ ALERTA: L'objecte rebut NO és una instància de Recipe. Claus disponibles:", Object.keys(recipeAsGeneric));
        }
    }
    // ---------------------------------------

    console.log(`🚫 Restriccions actives: ${restrictions.join(', ') || 'Cap'}`);

    const inventoryProps = inventoryEntities.map(i => i.props);
    
    // 2. Filtratge Local
    const validSavedRecipes = savedRecipes.filter((recipe: Recipe) => {
        // Assertion de seguretat en temps d'execució
        if (!(recipe instanceof Recipe)) return false;

        if (recipe.props.prepTimeMinutes && recipe.props.prepTimeMinutes > context.time) return false;
        
        // Ara cridem el mètode de forma segura
        if (!recipe.isSafeFor(restrictions)) return false; 
        
        const match = this.matcher.match(recipe, inventoryProps);
        return match.isPossible;
    });

    console.log(`✅ Receptes vàlides després de filtrar: ${validSavedRecipes.length}`);

    const finalSuggestions = [...validSavedRecipes].slice(0, TOTAL_SUGGESTIONS);
    
    // 3. Generació IA
    const needed = TOTAL_SUGGESTIONS - finalSuggestions.length;

    if (needed > 0) {
        const existingNames = finalSuggestions.map(r => r.name);
        try {
            const aiRecipes = await this.generator.generate(
                inventoryProps, 
                restrictions, 
                undefined, 
                existingNames
            );
            
            for (const recipe of aiRecipes) {
                if (finalSuggestions.length < TOTAL_SUGGESTIONS) finalSuggestions.push(recipe);
            }
        } catch (e) {
            console.error(`❌ Error Generació IA:`, e);
        }
    }

    return finalSuggestions;
  }
}