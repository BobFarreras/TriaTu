// ARXIU: core/usecases/shopping-list/AddToShoppingList.ts
import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';

export class AddToShoppingList {
  constructor(private readonly repo: ShoppingListRepository) {}

  // ✅ Assegura't que rep 'emoji'
  async execute(userId: string, name: string, quantity: number, unit: string, emoji?: string): Promise<void> {
    
    console.log("🏗️ [USE CASE] Creating item with emoji:", emoji); // LOG
    
    // ✅ I que el passa al create
    const item = ShoppingListItem.create(userId, name, quantity, unit, emoji);
    
    await this.repo.upsertItem(item);
  }
}