import { InventoryRepository } from "@/core/ports/InventoryRepository";
import { InventoryItem, InventoryItemProps } from "@/core/domain/entities/InventoryItem";

export class UpdateItem {
  constructor(private inventoryRepo: InventoryRepository) {}

  async execute(props: InventoryItemProps): Promise<void> {
    // 1. Reconstruïm l'entitat (això valida que les dades siguin coherents)
    const item = InventoryItem.create(props);

    // 2. Guardem (el repositori farà un UPDATE perquè l'ID ja existeix)
    await this.inventoryRepo.save(item);
  }
}