import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { Recipe } from '@/core/domain/entities/Recipe';
import { GenerationContext, GenerationMode } from '@/core/domain/types/GenerationContext';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
import { debug, error as logError } from '@/lib/logger';

export class GenerateMenuService {
  constructor(
    private inventoryRepo: InventoryRepository,
    private recipeRepo: RecipeRepository,
    private generator: RecipeGenerator,
    private profileRepo: UserProfileRepository
  ) {}

  async execute(
    userId: string,
    mode: GenerationMode,
    dishName: string,
    energy: number,
    time: number,
    lang: string = 'ca'
  ): Promise<Recipe[]> {
    debug('[Orchestrator] start');

    // 1. Load user data (inventory + profile)
    const inventory = await this.inventoryRepo.findByContext(userId);
    const profile = await this.profileRepo.getById(userId);

    const restrictions = (profile?.restrictions || []) as DietaryRestriction[];
    const userPreferences = profile?.foodPreferences || [];

    const finalRecipes: Recipe[] = [];
    const TARGET_COUNT = 4;

    // Dev flag: force AI mode
    const FORCE_AI_MODE = true;

    // 2. Phase 1: DB candidates (only in CHEF mode and if not forced)
    if (!FORCE_AI_MODE && mode === 'CHEF') {
      try {
        const dbCandidates = await this.recipeRepo.findMatches({ userId, limit: 50 });
        const inventoryNames = inventory.map(i => i.name.toLowerCase());

        const validCandidates = dbCandidates.filter((recipe: Recipe) => {
          if (!recipe.isSafeFor(restrictions)) return false;
          if (time > 0 && recipe.prepTimeMinutes > time) return false;

          const hasMatch = recipe.ingredients.some(ing =>
            inventoryNames.some(invName => ing.name.toLowerCase().includes(invName))
          );
          if (!hasMatch) return false;

          return true;
        });

        const shuffled = validCandidates.sort(() => 0.5 - Math.random());
        const selectedFromDB = shuffled.slice(0, TARGET_COUNT);

        debug('[Orchestrator] DB candidates selected');
        finalRecipes.push(...selectedFromDB);
      } catch (e) {
        logError('[Orchestrator] DB fallback', e);
      }
    } else {
      if (mode === 'FATE') debug('[Orchestrator] skip DB for FATE');
      else debug('[Orchestrator] force AI mode');
    }

    // 3. Phase 2: gap analysis
    const needed = TARGET_COUNT - finalRecipes.length;
    if (needed <= 0) return finalRecipes;

    // 4. Phase 3: prepare context
    debug('[Orchestrator] generating AI recipes');
    const existingNames = finalRecipes.map(r => r.name);

    let energyLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    if (energy > 80) energyLevel = 'HIGH';
    if (energy < 30) energyLevel = 'LOW';

    let vibe = 'Equilibrat i de mercat';

    if (mode === 'FATE') {
      if (userPreferences.length > 0) {
        const randomIndex = Math.floor(Math.random() * userPreferences.length);
        const chosenPref = userPreferences[randomIndex];
        vibe = `Estil ${chosenPref} (Basat en els teus gustos)`;
        debug('[Orchestrator] FATE vibe from profile');
      } else {
        vibe = 'Sorpresa creativa del Xef';
        debug('[Orchestrator] FATE vibe default');
      }
    }

    const context: GenerationContext = {
      mode,
      count: needed,
      language: lang,
      inventory: inventory.map(i => i.props),
      restrictions: restrictions,
      dislikes: existingNames,
      energyLevel,
      timeAvailableMinutes: time,
      focusDish: dishName || undefined,
      vibe: vibe
    };

    const aiRecipes = await this.generator.generate(context);

    // 5. Phase 4: mapping to volatile recipes
    const volatileAiRecipes = aiRecipes.map((recipe: Recipe) => {
      const props = recipe.toPrimitives();
      return new Recipe({
        ...props,
        id: crypto.randomUUID(),
        authorId: userId,
        isAiGenerated: true,
        isPublic: false,
        authorName: 'Xef IA',
        estimatedCost: props.estimatedCost,
        ingredients: props.ingredients
      });
    });

    finalRecipes.push(...volatileAiRecipes);
    return finalRecipes;
  }
}
