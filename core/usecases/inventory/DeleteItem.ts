import { InventoryRepository } from "@/core/ports/InventoryRepository";

export class DeleteItem {
  constructor(private inventoryRepo: InventoryRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new Error("ID required to delete item");
    await this.inventoryRepo.delete(id);
  }
}