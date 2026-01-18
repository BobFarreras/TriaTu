import { Recipe, Ingredient } from '@/core/domain/entities/Recipe';

export interface IngredientJSON {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    emoji?: string;
    linkedProductId?: string;
    linkedProductImage?: string;
    estimatedCost?: number;
}

export interface RecipeDBModel {
    id: string;
    user_id: string;
    name: string;
    ingredients: IngredientJSON[] | null;
    steps: string[] | object[] | null;
    tags: string[] | null;
    dietary_tags: string[] | null;
    prep_time_minutes: number | null;
    created_at: string | null;
    updated_at: string | null;
    is_public: boolean | null;
    author_name: string | null;
    likes_count: number | null;
    rating_avg: number | null;
    rating_count: number | null;
    rating_distribution: Record<string, number> | null;
    estimated_cost: number | null;
    is_ai_generated: boolean;
}

export interface RecipeWithJoins extends RecipeDBModel {
    preference_profiles: { username: string } | null;
    recipe_favorites: { user_id: string }[];
}

export class RecipeMapper {

    // ➡️ TO PERSISTENCE
    // ➡️ TO PERSISTENCE
    static toPersistence(recipe: Recipe) {
        // Corregim el mapeig per evitar passar nulls a IngredientJSON
        const ingredientsPayload: IngredientJSON[] = recipe.ingredients.map(i => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            emoji: i.emoji || '🥘',
            // Convertim null/undefined a undefined per complir amb IngredientJSON
            linkedProductId: i.linkedProductId ?? undefined,
            linkedProductImage: i.linkedProductImage ?? undefined,
            // Assegurem que estimatedCost sigui number
            estimatedCost: typeof i.estimatedCost === 'string' ? Number(i.estimatedCost) : i.estimatedCost
        }));

        return {
            id: recipe.id,
            user_id: recipe.authorId,
            name: recipe.name,
            ingredients: ingredientsPayload,
            steps: recipe.steps,
            tags: recipe.tags,
            dietary_tags: recipe.dietaryTags,
            prep_time_minutes: recipe.prepTimeMinutes,
            created_at: recipe.createdAt.toISOString(),
            updated_at: new Date().toISOString(),
            is_public: recipe.isPublic,
            is_ai_generated: recipe.isAiGenerated,
            estimated_cost: recipe.estimatedCost,
            likes_count: recipe.likesCount,
            author_name: recipe.authorName || 'Usuari'
        };
    }

    // ⬅️ TO DOMAIN
    static toDomain(row: RecipeWithJoins): Recipe {
        const rawIngredients = (Array.isArray(row.ingredients) ? row.ingredients : []) as IngredientJSON[];

        const validIngredients: Ingredient[] = rawIngredients
            .map((i) => ({
                id: i.id,
                name: i.name ? String(i.name).trim() : "Sense nom",
                quantity: Number(i.quantity),
                unit: i.unit ? String(i.unit) : "ut",
                emoji: i.emoji,
                // Llegeix els camps de vinculació
                linkedProductId: i.linkedProductId,
                linkedProductImage: i.linkedProductImage,
                estimatedCost: i.estimatedCost ? Number(i.estimatedCost) : 0
            }))
            .filter((i) => i.name.length > 0 && i.quantity > 0);

        let authorName = "Xef Anònim";
        if (row.is_ai_generated) {
            authorName = "✨ Chef IA";
        } else {
            authorName = row.preference_profiles?.username || row.author_name || "Xef Anònim";
        }

        const isFavorite = row.recipe_favorites && row.recipe_favorites.length > 0;

        const normalizedSteps = (Array.isArray(row.steps) ? row.steps : []).map((step: unknown) => {
            if (typeof step === 'string') return step;
            if (typeof step === 'object' && step !== null && 'content' in step) {
                return String((step as { content: string }).content || "");
            }
            return "";
        }).filter(s => s !== "");

        const rawDist = row.rating_distribution || {};
        const distribution: Record<number, number> = {};
        Object.entries(rawDist).forEach(([k, v]) => distribution[Number(k)] = Number(v));

        return new Recipe({
            id: row.id,
            authorId: row.user_id,
            name: row.name || "Recepta sense títol",
            ingredients: validIngredients,
            steps: normalizedSteps,
            tags: Array.isArray(row.tags) ? row.tags : [],
            dietaryTags: row.dietary_tags || [],
            prepTimeMinutes: row.prep_time_minutes || 0,
            createdAt: row.created_at ? new Date(row.created_at) : new Date(),
            likesCount: row.likes_count ?? 0,
            isPublic: row.is_public ?? true,
            authorName: authorName,
            estimatedCost: row.estimated_cost || 0,
            isAiGenerated: row.is_ai_generated,
            isFavorite: isFavorite,
            ratingSummary: {
                average: row.rating_avg ?? 0,
                count: row.rating_count ?? 0,
                distribution
            }
        });
    }
}