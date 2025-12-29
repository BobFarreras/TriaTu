// src/core/usecases/inventory/ConsumeItem.ts
import { InventoryRepository } from '@/core/ports/InventoryRepository';

export class ConsumeItem {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(itemId: string, quantityConsumed: number): Promise<void> {
    // 1. Recuperar l'entitat
    const item = await this.inventoryRepo.findById(itemId);
    
    if (!item) {
      throw new Error('Application Error: Item no trobat');
    }

    // 2. Calcular nova quantitat (Lògica d'aplicació sobre estat de l'entitat)
    const newQuantity = item.props.quantity - quantityConsumed;

    // 3. Orquestració: Actualitzar o Esborrar segons el resultat
    if (newQuantity <= 0) {
      await this.inventoryRepo.delete(itemId);
    } else {
      // Deleguem a l'entitat la creació de la nova instància (immutabilitat)
      const updatedItem = item.updateQuantity(newQuantity);
      await this.inventoryRepo.save(updatedItem);
    }
  }
}