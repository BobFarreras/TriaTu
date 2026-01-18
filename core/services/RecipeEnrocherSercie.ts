import { createClient } from '@/adapters/supabase/server';
import { Recipe } from '@/core/domain/entities/Recipe';

export class RecipeEnricherService {
  
  static async enrichRecipe(recipe: Recipe): Promise<Recipe> {
    const supabase = await createClient();
    const props = recipe.toPrimitives();

    let totalCost = 0;

    // Processar ingredients en paral·lel
    const enrichedIngredients = await Promise.all(props.ingredients.map(async (ing) => {
      // ✅ FIX 1: Convertim sempre a número per evitar error de tipus amb +=
      // Si és null o undefined, serà 0.
      const currentIngredientCost = ing.estimatedCost ? Number(ing.estimatedCost) : 0;

      // Si ja té vincle, només sumem el cost que ja tenia
      if (ing.linkedProductId && ing.linkedProductImage) {
        totalCost += currentIngredientCost;
        return ing;
      }

      // Si no té vincle, busquem a la BD
      const { data: match } = await supabase
        .from('product_catalog')
        .select('id, image_url, price, emoji')
        .ilike('name', `%${ing.name}%`)
        .limit(1)
        .single();

      if (match) {
        // Hem trobat un producte real!
        const matchPrice = match.price ? Number(match.price) : 0;
        
        // Sumem el preu trobat al total
        totalCost += matchPrice;

        return {
          ...ing,
          id: (!ing.id || ing.id.length < 10) ? match.id : ing.id, 
          emoji: match.emoji || ing.emoji,
          linkedProductId: match.id,
          linkedProductImage: match.image_url,
          estimatedCost: matchPrice // Assignem el nou preu
        };
      }

      // Si no trobem res, sumem el cost original (si en tenia)
      totalCost += currentIngredientCost;
      return ing;
    }));

    // Retornem nova recepta amb el cost total calculat
    return new Recipe({
      ...props,
      ingredients: enrichedIngredients,
      estimatedCost: totalCost
    });
  }
}