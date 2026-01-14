// ARXIU: core/usecases/inventory/ConsumeItem.ts
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InsufficientStockError } from '@/core/domain/entities/InventoryItem';

export class ConsumeItem {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(itemId: string, quantityConsumed: number): Promise<void> {
    // 1. Recuperar l'entitat
    const item = await this.inventoryRepo.findById(itemId);
    
    if (!item) {
      throw new Error('Application Error: Item no trobat');
    }

    // ✅ FIX PROBLEMA 1: Validar si en tenim prou ABANS de restar
    // Si volem consumir 500g i en tenim 100g, no ho esborrem, avisem.
    if (item.quantity < quantityConsumed) {
        // Calculem quan falta
        const missing = Number((quantityConsumed - item.quantity).toFixed(2));
        throw new InsufficientStockError(item.name, missing);
    }

    // 2. Calcular nova quantitat (Lògica d'aplicació sobre estat de l'entitat)
    // Utilitzem toFixed per evitar errors de flotant (0.1 + 0.2 !== 0.3)
    const newQuantity = Number((item.props.quantity - quantityConsumed).toFixed(2));

    // 3. Orquestració: Actualitzar o Esborrar segons el resultat
    if (newQuantity <= 0) {
      // Això passarà quan quantityConsumed === item.quantity (exacte)
      await this.inventoryRepo.delete(itemId);
    } else {
      // Deleguem a l'entitat la creació de la nova instància (immutabilitat)
      const updatedItem = item.updateQuantity(newQuantity);
      await this.inventoryRepo.save(updatedItem);
    }
  }
}