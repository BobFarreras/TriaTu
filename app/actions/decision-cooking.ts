'use server';

import { container } from '@/services/container';
import { RecipeProps } from '@/core/domain/entities/Recipe';


interface GenerateRecipeResult {
  success: boolean;
  recipe?: RecipeProps;
  error?: string;
}

export async function generateRecipeFromDecisionAction(userId: string, dishName: string): Promise<GenerateRecipeResult> {
  // 1. Validació bàsica
  if (!userId || !dishName) {
    return { success: false, error: "Falten dades per generar la recepta." };
  }

  try {
    // 2. Obtenir dependències del contenidor
    const inventoryUseCase = container.getGetUserInventory();
    const generator = container.getRecipeGenerator();

    // 3. Recuperar l'inventari real de l'usuari
    const inventory = await inventoryUseCase.execute(userId);
    const inventoryProps = inventory.map(item => item.props);

    // 4. (Opcional) Recuperar restriccions de l'usuari si calgués
    // Per simplicitat, ara passem array buit, però podries fer:
    // const userPrefs = await container.getUserPreferences().execute(userId);
    
    // 5. Generar la recepta ESPECÍFICA
    console.log(`👨‍🍳 Generant recepta per a: "${dishName}"...`);
    
    // Aquí passem el 'dishName' com a tercer paràmetre (focusDish)
    const recipes = await generator.generate(inventoryProps, [], dishName);

    // 6. Selecció de la millor opció
    // La IA hauria de retornar 1 sola recepta si li hem passat focusDish, 
    // però per seguretat agafem la primera.
    const bestMatch = recipes[0];

    if (!bestMatch) {
      return { 
        success: false, 
        error: `No s'ha pogut generar una recepta vàlida per a "${dishName}" amb el teu inventari actual.` 
      };
    }

    // 7. Retornar DTO (props)
    return { success: true, recipe: bestMatch.props };

  } catch (error) {
    console.error('Error in generateRecipeFromDecisionAction:', error);
    
    // Gestió d'errors segura
    const errorMessage = error instanceof Error ? error.message : "Error desconegut generant la recepta.";
    return { success: false, error: errorMessage };
  }
}