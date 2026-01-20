// ARXIU: src/core/usecases/shopping-list/GetShoppingHistory.ts
import { ShoppingListRepository } from "@/core/ports/ShoppingListRepository";
import { ShoppingSession } from "@/core/domain/entities/ShoppingSession";

export class GetShoppingHistory {
  constructor(private readonly repo: ShoppingListRepository) {}

  async execute(userId: string, roomId?: string | null): Promise<ShoppingSession[]> {
    return await this.repo.getHistory(userId, roomId);
  }
}
