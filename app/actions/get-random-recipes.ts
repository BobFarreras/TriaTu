'use server';

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
import { Recipe } from '@/core/domain/entities/Recipe'; // ✅ 1. IMPORTAR AIXÒ

export async function getRandomRecipesAction(userId: string, count: number = 1) {
  try {
    const supabase = await createClient();
    
    // 1. Obtenir Al·lèrgies
    const { data: profile } = await supabase
        .from('profiles') // O 'users' segons la teva BD
        .select('exclusions')
        .eq('user_id', userId)
        .single();

    const rawExclusions = profile?.exclusions || [];
    const restrictions = Array.isArray(rawExclusions) ? rawExclusions as DietaryRestriction[] : [];

    // 2. Cridar al Repositori
    // Ara container.getRecipeRepository() ja existirà gràcies al pas 1
    const repo = container.getRecipeRepository();
    
    // Això retorna Recipe[]
    const recipes = await repo.findRandom(count, restrictions);

    return { 
      success: true, 
      // ✅ 2. TIPATGE EXPLÍCIT: (r: Recipe)
      recipes: recipes.map((r: Recipe) => r.props) 
    };

  } catch (error) {
    console.error('Error getRandomRecipes:', error);
    return { success: false, error: 'Error obtenint inspiració' };
  }
}