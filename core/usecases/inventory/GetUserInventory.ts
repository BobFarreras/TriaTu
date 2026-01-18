// src/core/usecases/inventory/GetUserInventory.ts
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';

export class GetUserInventory {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(userId: string): Promise<InventoryItem[]> {
    return this.inventoryRepo.findByContext(userId);
  }
}