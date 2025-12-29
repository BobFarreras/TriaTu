// src/domain/inventory/InventoryRepository.ts

import { InventoryItem } from '@/core/domain/entities/InventoryItem';

export interface InventoryRepository {
  save(item: InventoryItem): Promise<void>;
  findById(id: string): Promise<InventoryItem | null>;
  findByUser(userId: string): Promise<InventoryItem[]>;
  delete(id: string): Promise<void>;
  
  // Mètode específic per ajudar a l'assistent de decisions
  findExpiringSoon(userId: string, daysThreshold: number): Promise<InventoryItem[]>;
}