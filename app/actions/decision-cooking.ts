'use server';

import { container } from '@/services/container';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { createClient } from '@/adapters/supabase/server';

interface SavedRecipeDB {
    id: string;
    user_id: string;
    name: string;
    ingredients: string | object;
    steps: string | object;
    tags: string | object;
    dietary_tags: string[] | null;
    rating_avg: number | null;
    rating_count: number | null;
    rating_distribution: object | null;
    prep_time_minutes: number | null;
    is_public: boolean;
    author_name?: string;
}

interface GenerateRecipeResult {
    success: boolean;
    recipes?: RecipeProps[];
    error?: string;
}

function safeParse<T>(input: string | object | null | undefined, fallback: T): T {
    if (!input) return fallback;
    if (typeof input === 'string') {
        try { return JSON.parse(input) as T; } catch (e) { return fallback; }
    }
    return input as T;
}

export async function generateRecipeFromDecisionAction(
    userId: string,
    dishName: string,
    lang: string = 'ca'
): Promise<GenerateRecipeResult> {

    console.log(`🚀 [ACTION] Start. User: ${userId}, Dish: ${dishName}`);
    if (!userId) return { success: false, error: "Falta l'ID d'usuari." };

    try {
        const generator = container.getRecipeGenerator();
        const inventoryUseCase = container.getGetUserInventory();

        const inventory = await inventoryUseCase.execute(userId);
        const inventoryProps = inventory.map(item => item.props);

        // --- PAS 1: BD ---
        let dbRecipes: RecipeProps[] = [];
        try {
            const supabase = await createClient();
            const { data: dbRaw } = await supabase.from('saved_recipes').select('*').limit(2);
            if (dbRaw) {
                const rawRecipes = dbRaw as unknown as SavedRecipeDB[];
                dbRecipes = rawRecipes.map((r) => ({
                    id: r.id,
                    authorId: r.user_id,
                    name: r.name,
                    ingredients: safeParse(r.ingredients, []),
                    steps: safeParse(r.steps, []),
                    tags: safeParse(r.tags, []),
                    dietaryTags: r.dietary_tags || [],
                    prepTimeMinutes: r.prep_time_minutes || 0,
                    likesCount: 0,
                    isPublic: r.is_public,
                    createdAt: new Date(),
                    ratingSummary: { average: r.rating_avg || 0, count: r.rating_count || 0, distribution: {} }
                }));
            }
        } catch (err) { console.error("⚠️ [HYBRID] DB Error (ignoring):", err); }

        // --- PAS 2: IA ---
        const needed = 4 - dbRecipes.length;
        let aiRecipes: RecipeProps[] = [];

        if (needed > 0) {
            console.log(`👨‍🍳 [HYBRID] Generating ${needed} AI recipes...`);
            const generated = await generator.generate(
                inventoryProps, [], dishName, undefined, needed, lang
            );
            
            // ✅ FIX QUANTITAT: .slice(0, needed)
            aiRecipes = generated
                .slice(0, needed) 
                .map(r => ({ ...r.props, isPublic: true }));
        }

        const finalRecipes = [...dbRecipes, ...aiRecipes];
        
        // ✅ FIX JSON: Sanitització final
        return { success: true, recipes: JSON.parse(JSON.stringify(finalRecipes)) };

    } catch (error) {
        console.error('❌❌ [ACTION ERROR]:', error);
        return { success: false, error: "Error intern." };
    }
}