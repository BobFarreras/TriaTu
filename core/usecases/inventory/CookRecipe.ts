import { InventoryRepository } from '@/core/ports/InventoryRepository'; // O core/domain/repositories depenent de la teva estructura
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';
import { Recipe } from '@/core/domain/entities/Recipe';

export class CookRecipe {
  constructor(
    private repo: InventoryRepository,
    private matcher: RecipeMatcher
  ) {}

  async execute(userId: string, recipe: Recipe): Promise<void> {
    // 1. Obtenir l'inventari (Això retorna ENTITATS InventoryItem)
    const inventoryEntities = await this.repo.findByUser(userId);

    // ✅ FIX 1: Extreure les 'props' per passar-les al Matcher
    // El matcher treballa amb dades pures (InventoryItemProps), no amb classes complexes.
    const inventoryProps = inventoryEntities.map(item => item.props);

    // 2. Comprovar viabilitat matemàtica usant les props
    const matchResult = this.matcher.match(recipe, inventoryProps);

    if (!matchResult.isPossible) {
      const missingNames = matchResult.missingIngredients.map(i => i.name).join(', ');
      throw new Error(`No tens prou ingredients: ${missingNames}`);
    }

    // 3. Preparar les actualitzacions
    const updates: { id: string; quantity: number }[] = [];
    const deletions: string[] = [];

    for (const used of matchResult.usedItems) {
      // ✅ FIX 2: Busquem dins les ENTITATS mirant la propietat .props.id
      const originalItem = inventoryEntities.find(i => i.props.id === used.inventoryId);
      
      if (originalItem) {
        // ✅ FIX 3: Accedim a .props.quantity per fer el càlcul
        const remaining = originalItem.props.quantity - used.amountToConsume;
        
        // Protecció contra decimals estranys
        const safeRemaining = Math.max(0, Number(remaining.toFixed(2)));

        // ✅ FIX 4: Accedim a .props.id per guardar els canvis
        if (safeRemaining === 0) {
          deletions.push(originalItem.props.id);
        } else {
          updates.push({ id: originalItem.props.id, quantity: safeRemaining });
        }
      }
    }

    // 4. Executar persistència
    if (updates.length > 0) {
      await this.repo.batchUpdate(updates);
    }

    if (deletions.length > 0) {
      await this.repo.batchDelete(deletions);
    }
  }
}