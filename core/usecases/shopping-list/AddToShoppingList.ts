// ARXIU: core/usecases/shopping-list/AddToShoppingList.ts
import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';

export class AddToShoppingList {
  constructor(private readonly repo: ShoppingListRepository) {}

  async execute(userId: string, name: string, quantity: number, unit: string): Promise<void> {
    // Aquí podries afegir lògica com: "Si és 'Pebre', posa quantitat per defecte 1 pot"
    // Per ara, és un pas directe però net.
    const item = ShoppingListItem.create(userId, name, quantity, unit);
    await this.repo.upsertItem(item);
  }
}