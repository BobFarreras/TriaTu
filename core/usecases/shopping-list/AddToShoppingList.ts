import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';

export class AddToShoppingList {
  constructor(private readonly repo: ShoppingListRepository) {}

  async execute(
    userId: string, 
    name: string, 
    quantity: number, 
    unit: string, 
    emoji?: string,
    // ✅ NOUS ARGUMENTS
    productId?: string,
    productImage?: string,
    estimatedCost?: number
  ): Promise<void> {
    
    console.log("🧠 [USECASE] Executing for:", { name, productId });

    // Creem l'entitat amb tots els camps
    const item = ShoppingListItem.create(
        userId, 
        name, 
        quantity, 
        unit, 
        emoji, 
        false, // isChecked
        productId,
        productImage,
        estimatedCost
    );
    
    await this.repo.upsertItem(item);
  }
}