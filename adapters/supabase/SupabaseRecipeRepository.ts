import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';
import { createClient } from '@/adapters/supabase/server';

export class SupabaseRecipeRepository implements RecipeRepository {

    async save(recipe: Recipe, userId: string): Promise<void> {
        const supabase = await createClient();

        const row = {
            id: recipe.props.id,
            user_id: userId,
            name: recipe.props.name,
            ingredients: recipe.props.ingredients, // Supabase converteix automàticament objectes a JSONB
            steps: recipe.props.steps,
            tags: recipe.props.tags,
            prep_time_minutes: recipe.props.prepTimeMinutes
        };

        const { error } = await supabase
            .from('saved_recipes')
            .upsert(row);

        if (error) {
            throw new Error(`Error saving recipe: ${error.message}`);
        }
    }

    async findById(id: string): Promise<Recipe | null> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('saved_recipes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        // Mapeig DB -> Entitat
        const props: RecipeProps = {
            id: data.id,
            name: data.name,
            ingredients: data.ingredients, // Postgres driver ja ho torna com array
            steps: data.steps,
            tags: data.tags,
            prepTimeMinutes: data.prep_time_minutes
        };

        return new Recipe(props);
    }
    async findAllByUser(userId: string): Promise<Recipe[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('saved_recipes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }); // Les més recents primer

        if (error) return [];

        return data.map(row => new Recipe({
            id: row.id,
            name: row.name,
            ingredients: row.ingredients,
            steps: row.steps,
            tags: row.tags,
            prepTimeMinutes: row.prep_time_minutes
        }));
    }
}