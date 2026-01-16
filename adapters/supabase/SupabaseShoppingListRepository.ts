// ARXIU: adapters/supabase/SupabaseShoppingListRepository.ts

import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { SupabaseClient } from '@supabase/supabase-js';
import { ShoppingSession, SnapshotItem } from '@/core/domain/entities/ShoppingSession';

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
  product_id?: string;
  product_image?: string;
  estimated_cost?: number
}
// ✅ 1. Definim la forma exacta de la fila a la BD (snake_case)
interface ShoppingSessionRow {
    id: string;
    user_id: string;
    created_at: string;
    total_cost: number;
    item_count: number;
    items_snapshot: SnapshotItem[]; // Supabase ja converteix JSONB a objecte JS
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
    console.log("💾 [REPO] Saving to DB:", {
      name: item.props.name,
      productId: item.props.productId,
      image: item.props.productImage
    });
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
          emoji: item.props.emoji,// ✅ Actualitzem l'emoji
          product_id: item.props.productId,
          product_image: item.props.productImage,
          estimated_cost: item.props.estimatedCost


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
      emoji: raw.emoji, // ✅ Recuperem l'emoji
      productId: raw.product_id,
      productImage: raw.product_image,
      estimatedCost: raw.estimated_cost
    });
  }
  // Dins de SupabaseShoppingListRepository.ts

  async saveSession(session: ShoppingSession): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_sessions')
      .insert({
        id: session.props.id,
        user_id: session.props.userId,
        created_at: session.props.createdAt.toISOString(),
        total_cost: session.props.totalCost,
        item_count: session.props.itemCount,
        items_snapshot: session.props.itemsSnapshot
      });
    if (error) throw new Error(error.message);
  }

  async getHistory(userId: string): Promise<ShoppingSession[]> {
    // Utilitzem generics o casting segur, però evitem 'any'
    const { data, error } = await this.supabase
      .from('shopping_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // ✅ 2. Casting segur a la nostra interfície 'ShoppingSessionRow'
    // Això diu a TS: "Confia en mi, la BD retorna això" sense usar 'any'
    const rows = data as unknown as ShoppingSessionRow[];

    return rows.map((row) => new ShoppingSession({
      id: row.id,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      totalCost: row.total_cost,
      itemCount: row.item_count,
      itemsSnapshot: row.items_snapshot
    }));
  }
}