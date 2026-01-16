import { RecipeRepository, RecipeFilter } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';
import { Rating } from '@/core/domain/entities/Rating';
import { createClient } from '@/adapters/supabase/server';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// --- INTERFÍCIES ---

interface IngredientJSON {
    name: string;
    quantity: number;
    unit: string;
    emoji?: string;
    linkedProductId?: string;
    linkedProductImage?: string;
    referencePrice?: number;
    estimatedCost?: number;
}

interface RecipeDBModel {
    id: string;
    user_id: string;
    name: string;
    ingredients: IngredientJSON[] | null;
    steps: string[] | null;
    tags: string[] | null;
    dietary_tags: string[] | null;
    prep_time_minutes: number | null;
    created_at: string | null;
    is_public: boolean | null;
    author_name: string | null;
    likes_count: number | null;
    rating_avg: number | null;
    rating_count: number | null;
    rating_distribution: Record<string, number> | null;
    estimated_cost: number | null;
    is_ai_generated: boolean;
}

interface RatingDBModel {
    recipe_id: string;
    value: number;
    user_id: string;
    created_at: string;
}

// ✅ 1. AQUESTA ÉS LA CLAU: El tipus complet amb els JOINs
interface RecipeWithJoins extends RecipeDBModel {
    preference_profiles: { username: string } | null;
    recipe_favorites: { user_id: string }[];
}

export class SupabaseRecipeRepository implements RecipeRepository {

    async save(recipe: Recipe): Promise<void> {
        const supabase = await createClient();

        // ✅ DEBUG LOG 3: Què arriba al Repositori just abans de guardar?
        console.log('💾 [DEBUG 3] REPO.save() - Rebent objecte:', {
            id: recipe.id,
            name: recipe.name,
            isPublicProp: recipe.isPublic, // Mirem la propietat de l'entitat
            props: recipe // Mirem tot l'objecte per si de cas
        });

        const row = {
            id: recipe.id,
            user_id: recipe.authorId,
            name: recipe.name,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            tags: recipe.tags,
            dietary_tags: recipe.dietaryTags,
            prep_time_minutes: recipe.prepTimeMinutes,
            created_at: recipe.createdAt.toISOString(),

            // 🔥 MODIFICACIÓ CLAU: Forcem el valor al row per descartar problemes de l'entitat
            // Si vols estar 100% segur que es guarda true, posa 'true' directament aquí.
            // Si posem (recipe.isPublic ?? true), i recipe.isPublic és false, es guardarà false.
            is_public: true,

            author_name: 'Usuari Comunitat',
            likes_count: recipe.likesCount
        };

        // ✅ DEBUG LOG 4: Què enviem exactament a Supabase?
        console.log('🛑 [DEBUG 4] Payload cap a Supabase:', {
            is_public: row.is_public
        });

        const { error } = await supabase.from('saved_recipes').upsert(row);

        if (error) {
            console.error("❌ [Repo] Error guardant:", error);
            throw new Error(`Error database: ${error.message}`);
        } else {
            console.log("✅ [Repo] Guardat amb èxit!");
        }
    }

    // --- SEARCH (Lectura Principal) ---
    async search(filter: RecipeFilter): Promise<{ recipes: Recipe[]; total: number }> {
        const supabase = await createClient();

        // Query amb JOINs
        let query = supabase.from('saved_recipes').select(`
            *,
            preference_profiles!user_id ( username ),
            recipe_favorites!left ( user_id )
        `, { count: 'exact' });

        // A) MINE
        if (filter.filterMode === 'MINE' && filter.userId) {
            query = query
                .eq('user_id', filter.userId)
                .eq('is_ai_generated', false);
        }
        // B) FAVORITES
        else if (filter.filterMode === 'FAVORITES' && filter.userId) {
            query = query.not('recipe_favorites', 'is', null)
                .eq('recipe_favorites.user_id', filter.userId);
        }
        // C) ALL (Comunitat)
        else {
            query = query.eq('is_public', true);
        }

        // Filtres extra
        if (filter.searchTerm) query = query.ilike('name', `%${filter.searchTerm}%`);
        if (filter.maxTimeMinutes) query = query.lte('prep_time_minutes', filter.maxTimeMinutes);
        if (filter.tags && filter.tags.length > 0) query = query.contains('dietary_tags', filter.tags);

        const limit = filter.limit || 10;
        const offset = filter.offset || 0;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("❌ Error cercant:", error);
            return { recipes: [], total: 0 };
        }

        // ✅ Casting correcte a RecipeWithJoins
        const rows = data as unknown as RecipeWithJoins[];

        return {
            recipes: rows.map((row) => this.mapToDomain(row)),
            total: count || 0
        };
    }

    // --- FINDBYID (Lectura Detall) ---
    async findById(id: string): Promise<Recipe | null> {
        const supabase = await createClient();

        // ✅ CORRECCIÓ: Afegim els JOINs aquí també!
        const { data, error } = await supabase
            .from('saved_recipes')
            .select(`
                *,
                preference_profiles!user_id ( username ),
                recipe_favorites!left ( user_id )
            `)
            .eq('id', id)
            .maybeSingle();

        if (error || !data) return null;

        // ✅ Casting a RecipeWithJoins (ara sí que té les propietats)
        return this.mapToDomain(data as unknown as RecipeWithJoins);
    }

    // --- FINDALLBYUSER (Lectura Perfil) ---
    async findAllByUser(userId: string): Promise<Recipe[]> {
        const supabase = await createClient();

        // ✅ CORRECCIÓ: Afegim els JOINs
        const { data, error } = await supabase
            .from("saved_recipes")
            .select(`
                *,
                preference_profiles!user_id ( username ),
                recipe_favorites!left ( user_id )
            `)
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching recipes:", error);
            throw new Error("Error DB");
        }
        if (!data) return [];

        const rows = data as unknown as RecipeWithJoins[];

        return rows.reduce((validRecipes: Recipe[], row) => {
            try {
                validRecipes.push(this.mapToDomain(row));
            } catch (e) {
                console.warn(`Ignorant recepta corrupta ${row.id}: ${e}`);
            }
            return validRecipes;
        }, []);
    }

    // --- FINDRANDOM (Suggeriments) ---
    async findRandom(count: number, _restrictions: DietaryRestriction[]): Promise<Recipe[]> {
        const supabase = await createClient();

        // ✅ CORRECCIÓ: Afegim els JOINs
        const { data } = await supabase
            .from('saved_recipes')
            .select(`
                *,
                preference_profiles!user_id ( username ),
                recipe_favorites!left ( user_id )
            `)
            .eq('is_public', true)
            .limit(50);

        if (!data) return [];

        const rows = data as unknown as RecipeWithJoins[];

        const validRecipes = rows.reduce((acc: Recipe[], row) => {
            try {
                acc.push(this.mapToDomain(row));
            } catch (e) { console.warn(`Ignorant recepta corrupta ${e}`) };
            return acc;
        }, []);

        return validRecipes.sort(() => 0.5 - Math.random()).slice(0, count);
    }



    // --- RATING / FAVORITES (Accions) ---

    async toggleFavorite(userId: string, recipeId: string): Promise<boolean> {
        const supabase = await createClient();

        const { data } = await supabase
            .from('recipe_favorites')
            .select('*')
            .eq('user_id', userId)
            .eq('recipe_id', recipeId)
            .maybeSingle();

        if (data) {
            await supabase.from('recipe_favorites').delete().eq('user_id', userId).eq('recipe_id', recipeId);
            return false;
        } else {
            await supabase.from('recipe_favorites').insert({ user_id: userId, recipe_id: recipeId });
            return true;
        }
    }

    async delete(id: string): Promise<void> {
        const supabase = await createClient();
        await supabase.from('saved_recipes').delete().eq('id', id);
    }

    // --- RATING IMPLEMENTATION ---

    async rate(rating: Rating): Promise<void> {
        return this.addRating(rating.recipeId, rating);
    }

    async addRating(recipeId: string, rating: Rating): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase.from('recipe_ratings').upsert({
            recipe_id: recipeId,
            user_id: rating.userId,
            value: rating.value,
            created_at: new Date().toISOString()
        });

        if (error && error.code === '23505') throw new Error("Ja has valorat aquesta recepta.");
        else if (error) throw new Error(`Error votant: ${error.message}`);
    }

    async getUserRatingForRecipe(userId: string, recipeId: string): Promise<Rating | null> {
        const supabase = await createClient();
        const { data } = await supabase.from('recipe_ratings')
            .select('*')
            .eq('user_id', userId)
            .eq('recipe_id', recipeId)
            .maybeSingle();

        if (!data) return null;

        return new Rating({
            userId: data.user_id,
            recipeId: data.recipe_id,
            value: data.value,
            createdAt: new Date(data.created_at),
            comment: undefined
        });
    }

    // ✅ FIX: Eliminat l'ANY amb tipatge estricte
    async getUserRatingsMap(userId: string, recipeIds: string[]): Promise<Record<string, number>> {
        const supabase = await createClient();

        const { data } = await supabase
            .from('recipe_ratings')
            .select('recipe_id, value')
            .eq('user_id', userId)
            .in('recipe_id', recipeIds);

        const map: Record<string, number> = {};

        if (data) {
            // Definim un tipus parcial localment per satisfer el compilador sense usar 'any'
            const ratings = data as unknown as Pick<RatingDBModel, 'recipe_id' | 'value'>[];

            ratings.forEach((r) => {
                map[r.recipe_id] = r.value;
            });
        }

        return map;
    }

    // --- MAPPER (El filtre final) ---

    // ✅ Reben RecipeWithJoins, així que TypeScript està content
    private mapToDomain(row: RecipeWithJoins): Recipe {
        const rawIngredients = Array.isArray(row.ingredients) ? row.ingredients : [];

        const validIngredients = rawIngredients
            .map((i) => ({
                name: i.name ? String(i.name).trim() : "Sense nom",
                quantity: Number(i.quantity),
                unit: i.unit ? String(i.unit) : "ut",
                emoji: i.emoji,
                linkedProductId: i.linkedProductId,
                linkedProductImage: i.linkedProductImage,
                estimatedCost: i.estimatedCost ? Number(i.estimatedCost) : undefined
            }))
            .filter((i) => i.name.length > 0 && i.quantity > 0);

        // ✅ RECUPEREM EL NOM CORRECTAMENT
        let authorName = "Xef Anònim";
        if (row.is_ai_generated) {
            authorName = "✨ Chef IA";
        } else {
            // Ara TypeScript sap que preference_profiles existeix a RecipeWithJoins
            authorName = row.preference_profiles?.username || row.author_name || "Xef Anònim";
        }

        const creationDate = row.created_at ? new Date(row.created_at) : new Date();
        const isFavorite = row.recipe_favorites && row.recipe_favorites.length > 0;

        const rawDist = row.rating_distribution || {};
        const distribution: Record<number, number> = {};
        Object.entries(rawDist).forEach(([k, v]) => distribution[Number(k)] = Number(v));
        // ✅ CORRECCIÓ CRÍTICA: Normalització de Steps
        // La BD pot tenir strings ["Pas 1"] o objectes [{ "content": "Pas 1" }]
        // Hem de garantir que al Domini sempre arribin strings plans.
        // ✅ FIX: Fem servir 'unknown' en lloc de 'any' i fem type narrowing
        const normalizedSteps = (Array.isArray(row.steps) ? row.steps : []).map((step: unknown) => {
            // 1. Si és un string normal ("Tallar ceba"), el retornem
            if (typeof step === 'string') return step;

            // 2. Si és un objecte ({ id: "...", content: "..." }), extraiem el contingut
            if (typeof step === 'object' && step !== null && 'content' in step) {
                // Forcem el casting perquè ja hem comprovat que és un objecte
                return String((step as { content: string }).content || "");
            }

            // 3. Si no és res conegut, retornem string buit
            return "";
        });
        return new Recipe({
            id: row.id,
            authorId: row.user_id,
            name: row.name || "Recepta sense títol",
            ingredients: validIngredients,
            steps: normalizedSteps, // ✅ Ara segur que són string[]
            tags: Array.isArray(row.tags) ? row.tags : [],
            dietaryTags: row.dietary_tags || [],
            prepTimeMinutes: row.prep_time_minutes || 0,
            createdAt: creationDate,
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