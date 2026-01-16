// ARXIU: src/core/application/shopping-list/GetShoppingHistory.ts
import { ShoppingListRepository } from "@/core/ports/ShoppingListRepository";
import { ShoppingSession } from "@/core/domain/entities/ShoppingSession";

export class GetShoppingHistory {
  constructor(private readonly repo: ShoppingListRepository) {}

  async execute(userId: string): Promise<ShoppingSession[]> {
    return await this.repo.getHistory(userId);
  }
}