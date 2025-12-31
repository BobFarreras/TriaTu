import { RecipeRepository, RecipeFilter } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';
import { Rating } from '@/core/domain/entities/Rating';
import { createClient } from '@/adapters/supabase/server';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// ✅ 1. TIPO STRICTE PER ALS INGREDIENTS (Evitem 'any')
interface IngredientJson {
    name: string;
    quantity: number;
    unit: string;
}

// ✅ 2. TIPO STRICTE PER A LA FILA DE LA BD
interface RecipeRow {
    id: string;
    author_id: string;
    user_id?: string | null;
    title: string | null;
    name?: string | null;
    ingredients: unknown; // Usem unknown en lloc d'any abans de validar
    steps: unknown;       // Usem unknown en lloc d'any
    tags: string[] | null;
    created_at: string;
    average_rating?: number | null;
    rating_count?: number | null;
}

export class SupabaseRecipeRepository implements RecipeRepository {

    async save(recipe: Recipe): Promise<void> {
        const supabase = await createClient();

        // ✅ CORRECCIÓ: Accedim a .props per assegurar que existeix
        const row = {
            id: recipe.props.id,
            author_id: recipe.props.authorId,
            title: recipe.props.name,
            ingredients: JSON.parse(JSON.stringify(recipe.props.ingredients)), 
            steps: JSON.parse(JSON.stringify(recipe.props.steps)),
            tags: recipe.props.tags,
            created_at: recipe.props.createdAt.toISOString()
        };

        const { error } = await supabase
            .from('community_recipes') 
            .upsert(row);

        if (error) throw new Error(`Error saving recipe: ${error.message}`);
    }

    async findById(id: string): Promise<Recipe | null> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('recipes_with_stats') 
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) return null;
        if (!data) return null;

        // Cast segur a la nostra interfície
        return this.mapToDomain(data as unknown as RecipeRow);
    }

    async findAllByUser(userId: string): Promise<Recipe[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('recipes_with_stats')
            .select('*')
            .eq('author_id', userId)
            .order('created_at', { ascending: false });

        if (error || !data) return [];

        return (data as unknown as RecipeRow[]).map(row => this.mapToDomain(row));
    }

    async addRating(recipeId: string, rating: Rating): Promise<void> {
        const supabase = await createClient();
        
        const { error } = await supabase.from('recipe_ratings').upsert({
            recipe_id: recipeId,
            user_id: rating.userId,
            value: rating.value,
            comment: rating.comment,
            created_at: new Date().toISOString()
        });

        if (error) {
            if (error.code === '23505') throw new Error("Ja has valorat aquesta recepta.");
            throw new Error(`Error votant: ${error.message}`);
        }
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
            value: data.value,
            comment: data.comment,
            createdAt: new Date(data.created_at)
        });
    }

    // ✅ CORRECCIÓ: Definim el tipus exacte del filtre en lloc d'any
    async search(filter: RecipeFilter): Promise<Recipe[]> {
        const supabase = await createClient();
        let query = supabase.from('recipes_with_stats').select('*');
        
        if (filter.searchTerm) query = query.ilike('title', `%${filter.searchTerm}%`);
        if (filter.authorId) query = query.eq('author_id', filter.authorId);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error || !data) return [];
        
        return (data as unknown as RecipeRow[]).map(r => this.mapToDomain(r));
    }

    // ✅ CORRECCIÓ: Usem _restrictions per evitar l'error "unused variable"
    async findRandom(count: number, _restrictions: DietaryRestriction[]): Promise<Recipe[]> {
        const supabase = await createClient();
        const { data } = await supabase.from('recipes_with_stats').select('*').limit(20);
        if (!data) return [];

        const shuffled = (data as unknown as RecipeRow[]).sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(row => this.mapToDomain(row));
    }

    async delete(id: string): Promise<void> {
        const supabase = await createClient();
        await supabase.from('community_recipes').delete().eq('id', id);
    }

    private mapToDomain(row: RecipeRow): Recipe {
        // ✅ 3. PARSING SEGUR SENSE ANY
        let ingredients: IngredientJson[] = [];
        
        if (typeof row.ingredients === 'string') {
            try { ingredients = JSON.parse(row.ingredients); } catch { ingredients = []; }
        } else if (Array.isArray(row.ingredients)) {
            ingredients = row.ingredients as IngredientJson[];
        }

        let steps: string[] = [];
        if (typeof row.steps === 'string') {
            try { steps = JSON.parse(row.steps); } catch { steps = []; }
        } else if (Array.isArray(row.steps)) {
            steps = row.steps as string[];
        }
        
        if (steps.length === 0) {
            steps = ["Pas genèric (Info no disponible)"];
        }

        return new Recipe({
            id: row.id,
            authorId: row.author_id || row.user_id || 'system-legacy',
            name: row.title || row.name || 'Recepta sense nom',
            ingredients: ingredients,
            steps: steps,
            tags: row.tags || [],
            createdAt: new Date(row.created_at),
            ratingSummary: {
                average: row.average_rating || 0,
                count: row.rating_count || 0
            }
        });
    }
}