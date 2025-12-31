// src/core/usecases/community/PublishRecipe.ts
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';
import { RecipeRepository } from '@/core/ports/RecipeRepository'; // O ports/RecipeRepository segons la teva estructura

export class PublishRecipe {
  constructor(private recipeRepo: RecipeRepository) {}

  async execute(userId: string, input: Omit<RecipeProps, 'id' | 'authorId' | 'createdAt' | 'ratingSummary'>): Promise<void> {
    
    // 1. Generem l'ID aquí o deixem que la DB ho faci. 
    // Per DDD pur, l'entitat ha de tenir ID al néixer. Usem un generador simple o UUID.
    const newId = crypto.randomUUID(); 

    // 2. Creem l'entitat. Això dispararà les validacions d'invariants (títol curt, ingredients buits...)
    const recipe = new Recipe({
      ...input,
      id: newId,
      authorId: userId,
      createdAt: new Date(),
      ratingSummary: { average: 0, count: 0 }
    });

    // 3. Guardem via el port
    await this.recipeRepo.save(recipe);
  }
}