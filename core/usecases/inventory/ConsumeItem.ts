// src/core/usecases/inventory/ConsumeItem.ts
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InsufficientStockError } from '@/core/domain/entities/InventoryItem';

export class ConsumeItem {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(itemId: string, quantityConsumed: number): Promise<void> {
    const item = await this.inventoryRepo.findById(itemId);
    
    if (!item) {
      throw new Error('Application Error: Item no trobat');
    }

    // Validació d'Estoc
    if (item.quantity < quantityConsumed) {
        // CORREGIT: Passem números al constructor, no strings.
        // Així compleix amb la signatura (number, number) de la classe d'error actualitzada.
        throw new InsufficientStockError(item.quantity, quantityConsumed);
    }

    const newQuantity = Number((item.quantity - quantityConsumed).toFixed(2));

    if (newQuantity <= 0) {
      await this.inventoryRepo.delete(itemId);
    } else {
      // Ara updateQuantity SÍ existeix a l'entitat
      const updatedItem = item.updateQuantity(newQuantity);
      await this.inventoryRepo.save(updatedItem);
    }
  }
}