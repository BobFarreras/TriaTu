import { ShoppingListRepository } from '@/core/ports/ShoppingListRepository';
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { SupabaseClient } from '@supabase/supabase-js';
import { ShoppingSession, SnapshotItem } from '@/core/domain/entities/ShoppingSession';

// Definim una interfície per a la fila de la DB (DTO)
interface ShoppingListItemRow {
  id: string;
  user_id: string;
  room_id?: string | null;
  name: string;
  quantity: number;
  unit: string;
  is_checked: boolean;
  added_at?: string;
  emoji?: string;
  product_id?: string;
  product_image?: string;
  estimated_cost?: number
}

interface ShoppingSessionRow {
    id: string;
    user_id: string;
    room_id?: string | null;
    created_at: string;
    total_cost: number;
    item_count: number;
    items_snapshot: SnapshotItem[]; 
}

export class SupabaseShoppingListRepository implements ShoppingListRepository {
  // Injectem el client (essencial per testejar amb mocks)
  constructor(private supabase: SupabaseClient) { }

  async findAll(userId: string, roomId?: string | null): Promise<ShoppingListItem[]> {
    let query = this.supabase
      .from('shopping_list_items')
      .select('*')
      .order('added_at', { ascending: false });

    if (roomId) {
      query = query.eq('room_id', roomId);
    } else {
      query = query.eq('user_id', userId).is('room_id', null);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Error fetching shopping list: ${error.message}`);

    return (data as unknown as ShoppingListItemRow[]).map(this.mapToDomain);
  }

  async upsertItem(item: ShoppingListItem): Promise<void> {
    // 1. Busquem si existeix utilitzant maybeSingle() per evitar errors si no hi és
    let findQuery = this.supabase
      .from('shopping_list_items')
      .select('*')
      .ilike('name', item.props.name);

    if (item.props.roomId) {
      findQuery = findQuery.eq('room_id', item.props.roomId);
    } else {
      findQuery = findQuery.eq('user_id', item.props.userId).is('room_id', null);
    }

    const { data: existing, error: fetchError } = await findQuery.maybeSingle();
    if (fetchError) throw new Error(fetchError.message);

    if (existing) {
      // UPDATE logic
      const existingItem = existing as unknown as ShoppingListItemRow;
      const newQuantity = Number(existingItem.quantity) + item.props.quantity;

      const { error } = await this.supabase
        .from('shopping_list_items')
        .update({
          quantity: newQuantity,
          is_checked: false, // Reactivem l'item si en comprem més
        })
        .eq('id', existingItem.id);

      if (error) throw error;

    } else {
      // INSERT logic
      const { error } = await this.supabase
        .from('shopping_list_items')
        .insert({
          user_id: item.props.userId,
          name: item.props.name,
          quantity: item.props.quantity,
          unit: item.props.unit,
          is_checked: item.props.isChecked,
          emoji: item.props.emoji,
          product_id: item.props.productId,
          product_image: item.props.productImage,
          estimated_cost: item.props.estimatedCost,
          room_id: item.props.roomId ?? null
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

  async toggleCheck(itemId: string, isChecked: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list_items')
      .update({ is_checked: isChecked })
      .eq('id', itemId);

    if (error) throw new Error(error.message);
  }

  async deleteMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from('shopping_list_items')
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
  }

  async saveSession(session: ShoppingSession): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_sessions')
      .insert({
        id: session.props.id,
        user_id: session.props.userId,
        room_id: session.props.roomId ?? null,
        created_at: session.props.createdAt.toISOString(),
        total_cost: session.props.totalCost,
        item_count: session.props.itemCount,
        items_snapshot: session.props.itemsSnapshot
      });
    if (error) throw new Error(error.message);
  }

  async getHistory(userId: string, roomId?: string | null): Promise<ShoppingSession[]> {
    let query = this.supabase
      .from('shopping_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (roomId) {
      query = query.eq('room_id', roomId);
    } else {
      query = query.eq('user_id', userId).is('room_id', null);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const rows = data as unknown as ShoppingSessionRow[];

    return rows.map((row) => new ShoppingSession({
      id: row.id,
      userId: row.user_id,
      roomId: row.room_id ?? null,
      createdAt: new Date(row.created_at),
      totalCost: row.total_cost,
      itemCount: row.item_count,
      itemsSnapshot: row.items_snapshot
    }));
  }

  private mapToDomain(raw: ShoppingListItemRow): ShoppingListItem {
    return new ShoppingListItem({
      id: raw.id,
      userId: raw.user_id,
      roomId: raw.room_id ?? null,
      name: raw.name,
      quantity: Number(raw.quantity),
      unit: raw.unit,
      isChecked: raw.is_checked,
      emoji: raw.emoji,
      productId: raw.product_id,
      productImage: raw.product_image,
      estimatedCost: raw.estimated_cost
    });
  }
}
