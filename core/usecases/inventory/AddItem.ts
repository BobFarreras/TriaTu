// src/core/usecases/inventory/AddItem.ts
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation'; // O on tinguis l'enum

export interface AddItemInput {
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  location: StorageLocation;
  expiryDate?: Date;
  addedAt: Date;
}

export class AddItem {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(input: AddItemInput): Promise<void> {
    // 1. Generem ID (aquí usem crypto natiu, igual que al teu MakeIndividualDecision)
    const id = crypto.randomUUID(); 

    // 2. Creem l'entitat (domini pur)
    const item = InventoryItem.create({
      id,
      ...input
    });

    // 3. Persistim via Port
    await this.inventoryRepo.save(item);
  }
}