// ARXIU: adapters/supabase/SupabaseRecipeRepository.ts
import { RecipeRepository, RecipeFilter } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';
import { Rating } from '@/core/domain/entities/Rating';
import { createClient } from '@/adapters/supabase/server'; // Comprova la teva ruta d'importació

import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// ✅ 1. ACTUALITZAR EL TIPUS INTERN DEL JSON
interface IngredientJSON {
    name: string;
    quantity: number;
    unit: string;
    // Camps opcionals nous per enllaç amb Bonpreu
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
}

interface RatingDBModel {
    recipe_id: string;
    value: number;
    user_id: string;
    created_at: string;
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

    async search(filter: RecipeFilter): Promise<{ recipes: Recipe[]; total: number }> {
        const supabase = await createClient();
        let query = supabase
            .from('saved_recipes')
            .select('*', { count: 'exact' })
            .eq('is_public', true);

        if (filter.searchTerm) query = query.ilike('name', `%${filter.searchTerm}%`);
        if (filter.maxTimeMinutes) query = query.lte('prep_time_minutes', filter.maxTimeMinutes);
        if (filter.minRating) query = query.gte('rating_avg', filter.minRating);
        if (filter.tags && filter.tags.length > 0) query = query.contains('dietary_tags', filter.tags);

        const limit = filter.limit || 10;
        const offset = filter.offset || 0;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error cercant receptes:", error);
            return { recipes: [], total: 0 };
        }

        return {
            recipes: data.map((row) => this.mapToDomain(row as unknown as RecipeDBModel)),
            total: count || 0
        };
    }

    async findById(id: string): Promise<Recipe | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('saved_recipes')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error || !data) return null;
        return this.mapToDomain(data as unknown as RecipeDBModel);
    }

    // ✅ MILLORA DE ROBUSTESA 1: findAllByUser
    async findAllByUser(userId: string): Promise<Recipe[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("saved_recipes")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching recipes:", error);
            throw new Error("Error fetching recipes from DB");
        }
        if (!data) return [];

        // Utilitzem reduce per descartar receptes que no compleixin les regles de negoci
        return data.reduce((validRecipes: Recipe[], row) => {
            try {
                const recipe = this.mapToDomain(row as unknown as RecipeDBModel);
                validRecipes.push(recipe);
            } catch (e) {
                // Si mapToDomain falla (ex: 0 ingredients vàlids), ignorem aquesta recepta
                console.warn(`⚠️ [RecipeRepo] Recepta corrupta ignorada (ID: ${row.id}):`, e);
            }
            return validRecipes;
        }, []);
    }

    // ✅ MILLORA DE ROBUSTESA 3: findRandom
    async findRandom(count: number, _restrictions: DietaryRestriction[]): Promise<Recipe[]> {
        const supabase = await createClient();
        const { data } = await supabase
            .from('saved_recipes')
            .select('*')
            .eq('is_public', true)
            .limit(50); // Agafem més de les necessàries per si algunes estan corruptes

        if (!data) return [];

        const validRecipes = data.reduce((acc: Recipe[], row) => {
            try {
                acc.push(this.mapToDomain(row as unknown as RecipeDBModel));
            } catch (e) { console.log(e) }
            return acc;
        }, []);

        const shuffled = validRecipes.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
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

    // ✅ MILLORA DE ROBUSTESA 4: mapToDomain (El filtre final)
    private mapToDomain(row: RecipeDBModel): Recipe {
        const rawIngredients = Array.isArray(row.ingredients) ? row.ingredients : [];

        // 1. SANEJAR I MAPPEJAR INGREDIENTS
        const validIngredients = rawIngredients
            .map((i) => ({
                name: i.name ? String(i.name).trim() : "Sense nom",
                quantity: Number(i.quantity),
                unit: i.unit ? String(i.unit) : "ut",

                // ✅ RECUPEREM ELS NOUS CAMPS
                // Si existeixen al JSON, els passem al domini. Si no, undefined.
                emoji: i.emoji,
                linkedProductId: i.linkedProductId,
                linkedProductImage: i.linkedProductImage,
                referencePrice: i.referencePrice ? Number(i.referencePrice) : undefined,
                estimatedCost: i.estimatedCost ? Number(i.estimatedCost) : undefined
            }))
            .filter((i) => i.name.length > 0 && i.quantity > 0);

        if (validIngredients.length === 0) {
            // Nota: Podries ser més lax aquí si vols permetre receptes sense ingredients temporalment
            throw new Error(`Recepta sense ingredients vàlids (Originals: ${rawIngredients.length})`);
        }

        const rawDist = row.rating_distribution || {};
        const distribution: Record<number, number> = {};
        Object.entries(rawDist).forEach(([k, v]) => {
            const key = Number(k);
            if (!isNaN(key)) distribution[key] = Number(v);
        });

        const creationDate = row.created_at ? new Date(row.created_at) : new Date();

        // Ara és segur cridar el constructor, perquè hem assegurat ingredients > 0
        return new Recipe({
            id: row.id,
            authorId: row.user_id,
            name: row.name || "Recepta sense títol",
            ingredients: validIngredients,
            steps: row.steps || [],
            tags: row.tags || [],
            dietaryTags: row.dietary_tags || [],
            prepTimeMinutes: row.prep_time_minutes || 0,
            createdAt: creationDate,
            likesCount: row.likes_count ?? 0,
            isPublic: row.is_public ?? true,
            ratingSummary: {
                average: row.rating_avg ?? 0,
                count: row.rating_count ?? 0,
                distribution
            }
        });
    }
}