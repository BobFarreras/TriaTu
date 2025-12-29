// src/core/usecases/inventory/GetExpiringItems.ts
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';

export class GetExpiringItems {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(userId: string, daysThreshold: number = 3): Promise<InventoryItem[]> {
    // Simplement delega al port, però manté la capa d'aplicació neta
    // Si en el futur volem filtrar per tipus de menjar, ho farem aquí.
    return this.inventoryRepo.findExpiringSoon(userId, daysThreshold);
  }
}