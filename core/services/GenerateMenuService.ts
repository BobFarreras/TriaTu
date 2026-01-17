import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { createClient } from '@/adapters/supabase/server';
import { GenerationContext, GenerationMode } from '@/core/domain/types/GenerationContext';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export class GenerateMenuService {
    constructor(
        private inventoryRepo: InventoryRepository,
        private recipeRepo: RecipeRepository,
        private generator: RecipeGenerator
    ) { }

    async execute(
        userId: string,
        mode: GenerationMode,
        dishName: string,
        energy: number,
        time: number,
        lang: string = 'ca'
    ): Promise<Recipe[]> {

        console.log(`🧠 [Orchestrator] Iniciant estratègia HÍBRIDA (${mode})...`);

        // 1. CARREGAR DADES USUARI
        const inventory = await this.inventoryRepo.findByUser(userId);
        const supabase = await createClient();
        const { data: profile } = await supabase.from('preference_profiles').select('*').eq('user_id', userId).single();

        const restrictions = (profile?.exclusions || []) as DietaryRestriction[];
        const finalRecipes: Recipe[] = [];
        const TARGET_COUNT = 4;
        
        // 🔥 DEV MODE: Canvia a false per usar BD
        const FORCE_AI_MODE = true; 

        // 2. FASE 1: CERCA A LA BASE DE DADES (Retrieval)
        if (!FORCE_AI_MODE) { 
            try {
                const dbCandidates = await this.recipeRepo.findMatches({ userId, limit: 50 });
                const inventoryNames = inventory.map(i => i.name.toLowerCase());

                const validCandidates = dbCandidates.filter((recipe: Recipe) => {
                    if (!recipe.isSafeFor(restrictions)) return false;
                    if (time > 0 && recipe.prepTimeMinutes > time) return false;
                    if (mode === 'CHEF') {
                        const hasMatch = recipe.ingredients.some(ing =>
                            inventoryNames.some(invName => ing.name.toLowerCase().includes(invName))
                        );
                        if (!hasMatch) return false;
                    }
                    return true;
                });

                const shuffled = validCandidates.sort(() => 0.5 - Math.random());
                const selectedFromDB = shuffled.slice(0, TARGET_COUNT);
                console.log(`📦 [DB Cache] Trobades ${validCandidates.length} vàlides. Seleccionades: ${selectedFromDB.length}`);
                finalRecipes.push(...selectedFromDB);

            } catch (e) {
                console.error("⚠️ Error buscant a la BD, passant a IA total.", e);
            }
        } else {
            console.log("🔥 [DEV MODE] Saltant la BD per forçar generació IA.");
        }

        // 3. FASE 2: GAP ANALYSIS
        const needed = TARGET_COUNT - finalRecipes.length;

        if (needed <= 0) {
            return finalRecipes;
        }

        // 4. FASE 3: GENERACIÓ IA
        console.log(`⚡ [Orchestrator] Falten ${needed} receptes. Cridant a la IA...`);
        const existingNames = finalRecipes.map(r => r.name);

        let energyLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
        if (energy > 80) energyLevel = 'HIGH';
        if (energy < 30) energyLevel = 'LOW';

        const context: GenerationContext = {
            mode,
            count: needed,
            language: lang,
            inventory: inventory.map(i => i.props),
            restrictions: restrictions,
            dislikes: existingNames,
            energyLevel,
            timeAvailableMinutes: time,
            focusDish: dishName || undefined
        };

        const aiRecipes = await this.generator.generate(context);

        // 🔥 FASE 4: NO GUARDEM (VOLÀTIL)
        // Retornem les receptes amb un ID temporal. L'usuari haurà de fer click per guardar-les.
        const volatileAiRecipes = aiRecipes.map((recipe: Recipe) => {
             // Clonem per afegir metadades sense persistir
             const props = recipe.toPrimitives();
             return new Recipe({
                 ...props,
                 id: crypto.randomUUID(), // ID temporal
                 authorId: userId,
                 isAiGenerated: true,
                 isPublic: false, // No visible fins que es guardi
                 authorName: "✨ Chef IA (Sugerencia)"
             });
        });

        finalRecipes.push(...volatileAiRecipes);

        return finalRecipes;
    }
}