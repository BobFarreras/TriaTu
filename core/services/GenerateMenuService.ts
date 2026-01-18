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

        // 1. CARREGAR DADES USUARI (Inventari + Perfil complet)
        const inventory = await this.inventoryRepo.findByUser(userId);
        const supabase = await createClient();
        
        // Recuperem tant les exclusions com les preferències de menjar
        const { data: profile } = await supabase
            .from('preference_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        const restrictions = (profile?.exclusions || []) as DietaryRestriction[];
        // ✅ Recuperem els gustos reals de l'usuari (ex: ['sushi', 'italian', ...])
        const userPreferences = (profile?.food_preferences || []) as string[];

        // LOGS DE DEPURACIÓ
        console.log("👤 [USER PROFILE] Dades carregades:");
        console.log(`   🚫 Restriccions: ${restrictions.length > 0 ? restrictions.join(', ') : 'CAP'}`);
        console.log(`   ❤️ Preferències: ${userPreferences.length > 0 ? userPreferences.join(', ') : 'CAP (Generic)'}`);
        console.log(`   📦 Inventari: ${inventory.length} items`);

        const finalRecipes: Recipe[] = [];
        const TARGET_COUNT = 4;
        
        // 🔥 DEV MODE: Canvia a false per usar BD
        const FORCE_AI_MODE = true; 

        // 2. FASE 1: CERCA A LA BASE DE DADES (Només en mode CHEF i si no forcem IA)
        if (!FORCE_AI_MODE && mode === 'CHEF') {
            try {
                // ✅ ARREGLAT: Usem la variable dbCandidates
                const dbCandidates = await this.recipeRepo.findMatches({ userId, limit: 50 });
                const inventoryNames = inventory.map(i => i.name.toLowerCase());

                const validCandidates = dbCandidates.filter((recipe: Recipe) => {
                    // Validem restriccions
                    if (!recipe.isSafeFor(restrictions)) return false;
                    // Validem temps
                    if (time > 0 && recipe.prepTimeMinutes > time) return false;
                    
                    // En mode CHEF, volem que com a mínim usin algun ingredient que tenim
                    const hasMatch = recipe.ingredients.some(ing =>
                        inventoryNames.some(invName => ing.name.toLowerCase().includes(invName))
                    );
                    if (!hasMatch) return false;
                    
                    return true;
                });

                // Selecció aleatòria dels candidats vàlids
                const shuffled = validCandidates.sort(() => 0.5 - Math.random());
                const selectedFromDB = shuffled.slice(0, TARGET_COUNT);
                
                console.log(`📦 [DB Cache] Trobades ${validCandidates.length} vàlides. Seleccionades: ${selectedFromDB.length}`);
                
                finalRecipes.push(...selectedFromDB);

            } catch (e) {
                console.error("⚠️ Error buscant a la BD, passant a IA total.", e);
            }
        } else {
            if (mode === 'FATE') console.log("✨ [FATE] Saltant caché de BD per usar preferències de l'usuari.");
            else console.log("🔥 [DEV MODE] Forçant generació IA (saltant BD).");
        }

        // 3. FASE 2: GAP ANALYSIS (Quantes ens falten?)
        const needed = TARGET_COUNT - finalRecipes.length;
        if (needed <= 0) return finalRecipes;

        // 4. FASE 3: PREPARAR EL "VIBE" (CONTEXT)
        console.log(`⚡ [Orchestrator] Generant ${needed} receptes amb IA...`);
        const existingNames = finalRecipes.map(r => r.name);

        let energyLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
        if (energy > 80) energyLevel = 'HIGH';
        if (energy < 30) energyLevel = 'LOW';

        // 🔥 LÒGICA DE VIBE REIAL 🔥
        let vibe = "Equilibrat i de mercat"; // Per defecte (Mode CHEF)

        if (mode === 'FATE') {
            if (userPreferences.length > 0) {
                // 🎲 Triem una preferència real de l'usuari a l'atzar
                const randomIndex = Math.floor(Math.random() * userPreferences.length);
                const chosenPref = userPreferences[randomIndex];
                
                // Formategem el vibe perquè la IA l'entengui bé
                vibe = `Estil ${chosenPref} (Basat en els teus gustos)`;
                
                console.log(`🎲 [FATE MODE] Vibe seleccionada del perfil: "${chosenPref}"`);
            } else {
                // Fallback si l'usuari no ha omplert el perfil
                vibe = "Sorpresa creativa del Xef";
                console.log(`🎲 [FATE MODE] Usuari sense preferències. Usant Vibe genèrica.`);
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
            vibe: vibe // ✅ Passem el gust de l'usuari o el genèric
        };

        const aiRecipes = await this.generator.generate(context);

        // 5. FASE 4: MAPPING VOLÀTIL
        // Retornem les receptes amb un ID temporal. L'usuari haurà de fer click per guardar-les.
        const volatileAiRecipes = aiRecipes.map((recipe: Recipe) => {
            const props = recipe.toPrimitives();
            return new Recipe({
                ...props,
                id: crypto.randomUUID(),
                authorId: userId,
                isAiGenerated: true,
                isPublic: false,
                authorName: "✨ Chef IA (Sugerencia)",
                // 👇 FORÇA EXPLÍCITAMENT EL COST I INGREDIENTS
                estimatedCost: props.estimatedCost,
                ingredients: props.ingredients
            });
        });

        finalRecipes.push(...volatileAiRecipes);

        return finalRecipes;
    }
}