import { RecipeRepository, RecipeFilter, MatchCriteria } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';
import { Rating } from '@/core/domain/entities/Rating';
import { createClient } from '@/adapters/supabase/server';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
// ✅ Importem el Mapper i les interfícies que hem creat
import { RecipeMapper, RecipeWithJoins, RecipeDBModel } from './mappers/RecipeMapper';

export class SupabaseRecipeRepository implements RecipeRepository {

    // --- SAVE (Upsert) ---
    async save(recipe: Recipe): Promise<void> {
        const supabase = await createClient();

        // 1. Convertim Domini -> BD
        const row = RecipeMapper.toPersistence(recipe);

        // 2. Guardem
        const { error } = await supabase.from('saved_recipes').upsert(row);

        if (error) {
            console.error("❌ [Repo] Error guardant:", error);
            throw new Error(`Error database: ${error.message}`);
        } else {
            console.log("✅ [Repo] Guardat amb èxit!");
        }
    }

    // --- SEARCH (Filtres avançats) ---
    async search(filter: RecipeFilter): Promise<{ recipes: Recipe[]; total: number }> {
        const supabase = await createClient();

        let query = supabase.from('saved_recipes').select(`
            *,
            preference_profiles!user_id ( username ),
            recipe_favorites!left ( user_id )
        `, { count: 'exact' });

        // Apliquem filtres
        if (filter.filterMode === 'MINE' && filter.userId) {
            query = query.eq('user_id', filter.userId).eq('is_ai_generated', false);
        } else if (filter.filterMode === 'FAVORITES' && filter.userId) {
            query = query.not('recipe_favorites', 'is', null).eq('recipe_favorites.user_id', filter.userId);
        } else {
            query = query.eq('is_public', true);
        }

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

        // 3. Convertim BD -> Domini
        const rows = data as unknown as RecipeWithJoins[];
        return {
            recipes: rows.map(row => RecipeMapper.toDomain(row)),
            total: count || 0
        };
    }

    // --- FIND BY ID ---
    async findById(id: string): Promise<Recipe | null> {
        const supabase = await createClient();
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

        return RecipeMapper.toDomain(data as unknown as RecipeWithJoins);
    }

    // --- FIND ALL BY USER ---
    async findAllByUser(userId: string): Promise<Recipe[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("saved_recipes")
            .select(`
                *,
                preference_profiles!user_id ( username ),
                recipe_favorites!left ( user_id )
            `)
            .eq("user_id", userId);

        if (error || !data) return [];

        const rows = data as unknown as RecipeWithJoins[];
        return rows.map(row => {
            try { return RecipeMapper.toDomain(row); }
            catch { return null; }
        }).filter((r): r is Recipe => r !== null);
    }

    // --- FIND RANDOM ---
    async findRandom(count: number, restrictions: DietaryRestriction[]): Promise<Recipe[]> {
        void restrictions;
        const supabase = await createClient();
        const { data } = await supabase
            .from('saved_recipes')
            .select(`
                *,
                preference_profiles!user_id ( username ),
                recipe_favorites!left ( user_id )
            `)
            .eq('is_public', true)
            .limit(50); // Pool de candidates

        if (!data) return [];

        const rows = data as unknown as RecipeWithJoins[];
        return rows
            .map(row => {
                try { return RecipeMapper.toDomain(row); } catch { return null; }
            })
            .filter((r): r is Recipe => r !== null)
            .sort(() => 0.5 - Math.random())
            .slice(0, count);
    }

    // --- FIND MATCHES (Per al Generador de Menús) ---
    async findMatches(criteria: MatchCriteria): Promise<Recipe[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('saved_recipes')
            .select(`
                *,
                preference_profiles!user_id ( username ),
                recipe_favorites!left ( user_id )
            `)
            .or(`is_public.eq.true,user_id.eq.${criteria.userId}`)
            .order('created_at', { ascending: false })
            .limit(criteria.limit || 50);

        if (error || !data) return [];

        const rows = data as unknown as RecipeWithJoins[];
        return rows.reduce((acc: Recipe[], row) => {
            try { acc.push(RecipeMapper.toDomain(row)); } catch { }
            return acc;
        }, []);
    }

    // --- FAVORITES ---
    async toggleFavorite(userId: string, recipeId: string): Promise<boolean> {
        const supabase = await createClient();
        const { data } = await supabase.from('recipe_favorites').select('*').eq('user_id', userId).eq('recipe_id', recipeId).maybeSingle();

        if (data) {
            await supabase.from('recipe_favorites').delete().eq('user_id', userId).eq('recipe_id', recipeId);
            return false;
        } else {
            await supabase.from('recipe_favorites').insert({ user_id: userId, recipe_id: recipeId });
            return true;
        }
    }

    // --- DELETION ---
    async delete(id: string, authorId: string): Promise<void> {
        const supabase = await createClient();

        // 1. Fem la consulta a Supabase
        const { error, count } = await supabase
            .from('saved_recipes') // Nom correcte de la taula
            .delete({ count: 'exact' }) // Demanem el recompte per validar
            .match({
                id: id,
                user_id: authorId // ✅ MAPPEIG CLAU: Domini (authorId) -> DB (user_id)
            });

        // 2. Gestió d'errors d'infraestructura (connexió, permisos SQL, etc.)
        if (error) {
            throw new Error(`Infrastructure error deleting recipe: ${error.message}`);
        }

        // 3. Validació lògica (opcional però recomanada)
        // Si count és 0, no ha fallat l'SQL, però no s'ha esborrat res 
        // (perquè l'ID no existia o l'usuari no n'era el propietari).
        if (count === 0) {
            console.warn(`Delete operation affecting 0 rows. RecipeId: ${id}, UserId: ${authorId}`);
        }
    }

    // --- RATINGS ---
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

    async getUserRatingsMap(userId: string, recipeIds: string[]): Promise<Record<string, number>> {
        const supabase = await createClient();
        const { data } = await supabase
            .from('recipe_ratings')
            .select('recipe_id, value')
            .eq('user_id', userId)
            .in('recipe_id', recipeIds);

        const map: Record<string, number> = {};
        if (data) {
            // Pick parcial per evitar 'any'
            const ratings = data as unknown as Pick<RecipeDBModel, 'id'> & { recipe_id: string, value: number }[];
            ratings.forEach((r) => map[r.recipe_id] = r.value);
        }
        return map;
    }
}
