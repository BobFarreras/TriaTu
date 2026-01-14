// ARXIU: core/usecases/shopping-list/CompleteShoppingSession.ts
import { ShoppingListRepository } from "@/core/ports/ShoppingListRepository";
import { InventoryRepository } from "@/core/ports/InventoryRepository";
import { InventoryItem } from "@/core/domain/entities/InventoryItem";
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { getIngredientEmoji } from '@/lib/utils/emojiUtils'; // Helper que ja tenies
export class CompleteShoppingSession {
  constructor(
    private readonly shoppingListRepo: ShoppingListRepository,
    private readonly inventoryRepo: InventoryRepository
  ) { }

  async execute(userId: string): Promise<{ added: number }> {
    // 1. Obtenir tota la llista
    const allItems = await this.shoppingListRepo.findAll(userId);

    // 2. Filtrar només els marcats (Checked)
    const boughtItems = allItems.filter(item => item.props.isChecked);

    if (boughtItems.length === 0) {
      return { added: 0 };
    }

    // 3. Convertir ShoppingListItem -> InventoryItem
    const inventoryItems = boughtItems.map(item => {
      // ✅ MILLORA: Si l'item de la llista té emoji, l'usem. Si no, el calculem.
      const finalEmoji = item.props.emoji && item.props.emoji !== '📦'
        ? item.props.emoji
        : getIngredientEmoji(item.props.name);
      // Podríem usar un helper per calcular caducitat aquí, però per simplificar usem defaults
      return InventoryItem.create({
        id: crypto.randomUUID(),
        userId: userId,
        name: item.props.name,
        quantity: item.props.quantity,
        unit: item.props.unit,
        location: StorageLocation.PANTRY, // Per defecte
        emoji: finalEmoji, // ✅ Ara sí!
        addedAt: new Date()
      });
    });

    // 4. Guardar a l'Inventari (Batch)
    // (Nota: Assegura't que InventoryRepository té saveBatch, el vam afegir al pas anterior)
    await this.inventoryRepo.saveBatch(inventoryItems);

    // 5. Eliminar de la Llista de la Compra (Neteja)
    const idsToDelete = boughtItems.map(i => i.props.id);
    await this.shoppingListRepo.deleteMany(idsToDelete);

    // 6. (Opcional) Aquí podries guardar un registre a 'shopping_history' si volguessis escalar

    return { added: inventoryItems.length };
  }
}