import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export class FallbackRecipeGenerator implements RecipeGenerator {
  
  constructor(
    private readonly primary: RecipeGenerator,
    private readonly secondary: RecipeGenerator
  ) {}

  async generate(
    inventory: InventoryItemProps[], 
    restrictions: DietaryRestriction[],
    focusDish?: string,
    excludeNames?: string[]
  ): Promise<Recipe[]> {
    console.log("🔄 [FALLBACK] Iniciant estratègia de generació...");
    
    try {
      console.log("🔹 Provant PRIMARI (Gemini)...");
      const result = await this.primary.generate(inventory, restrictions, focusDish, excludeNames);
      console.log("✅ Primari OK.");
      return result;

    } catch (error) {
      console.error("🔸 Primari ha fallat. Motiu:", error);
      
      console.log("🔹 Provant SECUNDARI (OpenAI)...");
      try {
        const result = await this.secondary.generate(inventory, restrictions, focusDish, excludeNames);
        console.log("✅ Secundari OK.");
        return result;
      } catch (secondaryError) {
        console.error("💀 TOT HA FALLAT:", secondaryError);
        return [];
      }
    }
  }
}