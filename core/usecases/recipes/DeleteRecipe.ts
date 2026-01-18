// src/core/application/use-cases/recipes/DeleteRecipe.ts
import { RecipeRepository } from '@/core/ports/RecipeRepository';

export class DeleteRecipe {
  constructor(private recipeRepository: RecipeRepository) {}

  async execute(recipeId: string, userId: string): Promise<void> {
    if (!recipeId) throw new Error('Recipe ID is required');
    if (!userId) throw new Error('User ID is required');

    // La validació de si la recepta existeix o si l'usuari és propietari
    // es delega al repositori per eficiència (una sola query),
    // o es pot fer aquí si es vol lògica de domini més complexa.
    // Per Clean Arch pragmàtica, passem authorId per assegurar integritat.
    await this.recipeRepository.delete(recipeId, userId);
  }
}