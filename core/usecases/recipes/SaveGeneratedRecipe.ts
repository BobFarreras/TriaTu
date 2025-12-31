import { Recipe } from "@/core/domain/entities/Recipe";
import { RecipeRepository } from "@/core/ports/RecipeRepository"; // o ports

export class SaveGeneratedRecipe {
  constructor(private recipeRepo: RecipeRepository) {}

  async execute(recipe: Recipe, userId: string): Promise<void> {
    // 1. VALIDACIÓ DE SEGURETAT
    if (!userId) {
        throw new Error("No es pot guardar una recepta sense un usuari propietari.");
    }

    // 2. "ADOPCIÓ" DE LA RECEPTA
    // Creem una nova instància (per immutabilitat) canviant l'authorId
    // de 'ai-generated' a l'UUID real de l'usuari (userId).
    const adoptedRecipe = new Recipe({
        ...recipe.props, // Copiem totes les dades (ingredients, passos, etc.)
        authorId: userId, // ✅ AQUI ESTA LA CLAU DEL FIX
        createdAt: new Date(), // Actualitzem la data de creació al moment de guardar
        likesCount: 0,
        ratingSummary: { average: 0, count: 0, distribution: {} }
    });

    // 3. PERSISTÈNCIA
    // Ara 'adoptedRecipe' té un UUID vàlid i la BD no es queixarà.
    await this.recipeRepo.save(adoptedRecipe);
  }
}