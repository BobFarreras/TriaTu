import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export class FallbackRecipeGenerator implements RecipeGenerator {
  
  constructor(
    private readonly primary: RecipeGenerator,
    private readonly secondary: RecipeGenerator
  ) {}

  async generate(inventory: InventoryItemProps[], restrictions: DietaryRestriction[]): Promise<Recipe[]> {
    try {
      // 1. Intentem Gemini
      // console.log("🍳 Provant Gemini per cuinar...");
      return await this.primary.generate(inventory, restrictions);

    } catch (error) {
      console.error("❌ Gemini ha fallat generant receptes:", error);
      
      // 2. Intentem OpenAI
      console.warn("⚠️ Activant OpenAI (Fallback) per receptes...");
      try {
        return await this.secondary.generate(inventory, restrictions);
      } catch (secondaryError) {
        // 3. Tot ha fallat
        console.error("💀 Error Crític: Cap xef (IA) disponible.", secondaryError);
        return [];
      }
    }
  }
}