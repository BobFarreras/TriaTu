import { Recipe } from '@/core/domain/entities/Recipe';
import { ProductCatalogRepository } from '@/core/ports/ProductCatalogRepository';

export class RecipeEnricherService {
  constructor(private catalogRepo: ProductCatalogRepository) {}

  async enrichRecipe(recipe: Recipe): Promise<Recipe> {
    const props = recipe.toPrimitives();
    let totalCost = 0;

    const enrichedIngredients = await Promise.all(props.ingredients.map(async (ing) => {
      const currentIngredientCost = ing.estimatedCost ? Number(ing.estimatedCost) : 0;

      if (ing.linkedProductId && ing.linkedProductImage) {
        totalCost += currentIngredientCost;
        return ing;
      }

      const matches = await this.catalogRepo.searchByName(ing.name);
      const match = matches && matches.length > 0 ? matches[0] : null;

      if (match) {
        const matchPrice = match.price ? Number(match.price) : 0;
        totalCost += matchPrice;

        return {
          ...ing,
          id: (!ing.id || ing.id.length < 10) ? match.id : ing.id,
          emoji: match.props.emoji || ing.emoji,
          linkedProductId: match.id,
          linkedProductImage: match.props.image,
          estimatedCost: matchPrice
        };
      }

      totalCost += currentIngredientCost;
      return ing;
    }));

    return new Recipe({
      ...props,
      ingredients: enrichedIngredients,
      estimatedCost: totalCost
    });
  }
}
