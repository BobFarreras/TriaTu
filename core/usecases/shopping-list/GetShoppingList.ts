// ARXIU: core/usecases/shopping-list/GetShoppingList.ts
import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';

export class GetShoppingList {
  constructor(private readonly repo: ShoppingListRepository) {}

  async execute(userId: string, roomId?: string | null): Promise<ShoppingListItem[]> {
    return this.repo.findAll(userId, roomId);
  }
}
