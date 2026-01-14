// src/ports/InventoryRepository.ts

import { InventoryItem } from '@/core/domain/entities/InventoryItem';

export interface InventoryRepository {
  save(item: InventoryItem): Promise<void>;
  findById(id: string): Promise<InventoryItem | null>;
  findByUser(userId: string): Promise<InventoryItem[]>;
  delete(id: string): Promise<void>;
  
  // Mètode específic per ajudar a l'assistent de decisions
  findExpiringSoon(userId: string, daysThreshold: number): Promise<InventoryItem[]>;
  // ✅ NOU MÈTODE: Per restar quantitats de múltiples productes de cop
  // Rebrà una llista d'objectes amb { id, quantity } (la nova quantitat o la diferència)
  batchUpdate(updates: { id: string; quantity: number }[]): Promise<void>;
  
  // També necessitem poder esborrar items si la quantitat arriba a 0
  batchDelete(ids: string[]): Promise<void>;
  saveBatch(items: InventoryItem[]): Promise<void>;

}