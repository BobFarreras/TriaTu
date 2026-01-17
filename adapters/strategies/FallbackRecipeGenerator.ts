import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { GenerationContext } from '@/core/domain/types/GenerationContext';

export class FallbackRecipeGenerator implements RecipeGenerator {
  
  constructor(
    private readonly primary: RecipeGenerator,
    private readonly secondary: RecipeGenerator
  ) {}

  // ✅ CORRECCIÓ: Ara acceptem 'context' com a únic argument
  async generate(context: GenerationContext): Promise<Recipe[]> {
    console.log("🔄 [FALLBACK] Iniciant estratègia de generació...");
    
    try {
      console.log("🔹 Provant PRIMARI (Gemini)...");
      const result = await this.primary.generate(context);
      console.log("✅ Primari OK.");
      return result;

    } catch (error) {
      console.error("🔸 Primari ha fallat. Motiu:", error);
      
      console.log("🔹 Provant SECUNDARI (OpenAI)...");
      try {
        const result = await this.secondary.generate(context);
        console.log("✅ Secundari OK.");
        return result;
      } catch (secondaryError) {
        console.error("💀 TOT HA FALLAT:", secondaryError);
        return [];
      }
    }
  }
}