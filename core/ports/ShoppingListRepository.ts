// ARXIU: core/ports/ShoppingListRepository.ts
import { ShoppingListItem } from "../domain/entities/ShoppingListItem";

export interface ShoppingListRepository {
  // Retorna tots els items de l'usuari
  findAll(userId: string): Promise<ShoppingListItem[]>;
  
  // Afegeix o actualitza (si ja existeix el nom, suma quantitat)
  upsertItem(item: ShoppingListItem): Promise<void>;
  
  // Elimina un item
  delete(id: string): Promise<void>;

  // ✅ NOUS MÈTODES PER GESTIÓ D'ESTAT
  toggleCheck(itemId: string, isChecked: boolean): Promise<void>;
  deleteMany(ids: string[]): Promise<void>; // Per netejar la llista en acabar
}