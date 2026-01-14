// ARXIU: core/application/use-cases/AddToShoppingListUseCase.ts
import { ShoppingListRepository } from "@/core/ports/ShoppingListRepository";
import { ShoppingListItem } from "@/core/domain/entities/ShoppingListItem";

export class AddToShoppingListUseCase {
  constructor(private shoppingListRepo: ShoppingListRepository) {}

  async execute(userId: string, name: string, quantity: number, unit: string): Promise<void> {
    // Validacions bàsiques de negoci
    if (quantity <= 0) throw new Error("La quantitat ha de ser positiva");

    // Creem l'entitat (ella mateixa es valida)
    const item = ShoppingListItem.create(userId, name, quantity, unit);

    // Persistim (el repositori ja s'encarrega de sumar si existeix)
    await this.shoppingListRepo.upsertItem(item);
  }
}