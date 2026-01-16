// ARXIU: src/core/ports/ShoppingListRepository.ts
import { ShoppingListItem } from "../domain/entities/ShoppingListItem";
// ✅ IMPORTAR L'ENTITAT NOVA
import { ShoppingSession } from "../domain/entities/ShoppingSession";

export interface ShoppingListRepository {
  // --- Mètodes existents ---
  findAll(userId: string): Promise<ShoppingListItem[]>;
  upsertItem(item: ShoppingListItem): Promise<void>;
  delete(id: string): Promise<void>;
  toggleCheck(itemId: string, isChecked: boolean): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;

  // ✅ NOUS MÈTODES QUE FALTAVEN:
  saveSession(session: ShoppingSession): Promise<void>;
  getHistory(userId: string): Promise<ShoppingSession[]>;
}