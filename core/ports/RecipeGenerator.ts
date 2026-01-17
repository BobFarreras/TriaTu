import { Recipe } from '@/core/domain/entities/Recipe';
// Assegura't que la ruta d'importació és correcta segons la teva estructura
import { GenerationContext } from '@/core/domain/types/GenerationContext';

export interface RecipeGenerator {
  // ✅ ARA: Accepta un únic objecte de context (molt més net)
  generate(context: GenerationContext): Promise<Recipe[]>;
}