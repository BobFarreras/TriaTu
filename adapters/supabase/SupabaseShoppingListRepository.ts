// ARXIU: adapters/supabase/SupabaseShoppingListRepository.ts

import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { SupabaseClient } from '@supabase/supabase-js';

// Definim una interfície per a la fila de la DB (DTO)
interface ShoppingListItemRow {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  is_checked: boolean;
  added_at?: string;
  emoji?: string; // ✅ NOU
}

export class SupabaseShoppingListRepository implements ShoppingListRepository {
  constructor(private supabase: SupabaseClient) { }

  async findAll(userId: string): Promise<ShoppingListItem[]> {
    const { data, error } = await this.supabase
      .from('shopping_list_items')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw new Error(`Error fetching shopping list: ${error.message}`);

    // Casting segur perquè sabem l'esquema de Supabase
    return (data as unknown as ShoppingListItemRow[]).map(this.mapToDomain);
  }

  async upsertItem(item: ShoppingListItem): Promise<void> {
    const { data: existing } = await this.supabase
      .from('shopping_list_items')
      .select('*')
      .eq('user_id', item.props.userId)
      .ilike('name', item.props.name)
      .single();

    if (existing) {
      // Tipem l'objecte existent
      const existingItem = existing as unknown as ShoppingListItemRow;
      const newQuantity = Number(existingItem.quantity) + item.props.quantity;

      const { error } = await this.supabase
        .from('shopping_list_items')
        .update({
          quantity: newQuantity,
          is_checked: false,
        })
        .eq('id', existingItem.id);

      if (error) throw error;

    } else {
      console.log("💾 [REPO] Inserting:", item.props.emoji); // LOG
      const { error } = await this.supabase
        .from('shopping_list_items')
        .insert({
          user_id: item.props.userId,
          name: item.props.name,
          quantity: item.props.quantity,
          unit: item.props.unit,
          is_checked: item.props.isChecked,
          emoji: item.props.emoji // ✅ Actualitzem l'emoji

        });

      if (error) throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
  // ✅ Implementació Toggle
  async toggleCheck(itemId: string, isChecked: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list_items')
      .update({ is_checked: isChecked })
      .eq('id', itemId);

    if (error) throw new Error(error.message);
  }

  // ✅ Implementació DeleteMany
  async deleteMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from('shopping_list_items')
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
  }
  // ✅ CORRECCIÓ: Substituïm 'any' per la interfície Row
  private mapToDomain(raw: ShoppingListItemRow): ShoppingListItem {
    return new ShoppingListItem({
      id: raw.id,
      userId: raw.user_id,
      name: raw.name,
      quantity: Number(raw.quantity),
      unit: raw.unit,
      isChecked: raw.is_checked,
      emoji: raw.emoji // ✅ Recuperem l'emoji
    });
  }
}