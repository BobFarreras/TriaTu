// ARXIU: adapters/supabase/SupabaseInventoryRepository.ts

import { InventoryRepository } from '@/core/ports/InventoryRepository'; // o domain/repositories
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { createClient } from '@/adapters/supabase/server'; // o adapters/supabase/server

interface InventoryItemRow {
  id: string;
  user_id: string;
  name: string;
  emoji: string | null;
  quantity: number;
  unit: string;
  location: string;
  expiry_date: string | null;
  added_at: string;
}

// Helper per separar emojis
function splitEmoji(text: string): { emoji: string | undefined; name: string } {
  const regex = /^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*/;
  const match = text.match(regex);
  if (match) {
    return { emoji: match[1], name: text.replace(match[0], '').trim() };
  }
  return { emoji: undefined, name: text.trim() };
}

export class SupabaseInventoryRepository implements InventoryRepository {

  private toDomain(row: InventoryItemRow): InventoryItem {
    let finalEmoji = row.emoji;
    let finalName = row.name;

    // Migració automàtica: si l'emoji està al nom, l'extraiem
    if (!finalEmoji && finalName) {
        const separated = splitEmoji(finalName);
        if (separated.emoji) {
            finalEmoji = separated.emoji;
            finalName = separated.name;
        }
    }

    return InventoryItem.create({
      id: row.id,
      userId: row.user_id,
      name: finalName,
      emoji: finalEmoji || undefined, // Ara TS no es queixarà
      quantity: Number(row.quantity),
      unit: row.unit,
      location: row.location as StorageLocation,
      expiryDate: row.expiry_date ? new Date(row.expiry_date) : undefined,
      addedAt: new Date(row.added_at)
    });
  }

  async save(item: InventoryItem): Promise<void> {
    const supabase = await createClient();

    const row = {
      id: item.id,
      user_id: item.userId,
      name: item.name,
      emoji: item.emoji, // Guardem l'emoji net
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,
      expiry_date: item.expiryDate ? item.expiryDate.toISOString() : null,
      added_at: item.addedAt.toISOString()
    };

    const { error } = await supabase.from('inventory_items').upsert(row);

    if (error) {
      console.error('Error saving inventory item:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.toDomain(data as InventoryItemRow);
  }

  async findByUser(userId: string): Promise<InventoryItem[]> {
    const supabase = await createClient();
    
    // Utilitzem reduce per filtrar errors silenciosament (Robustesa)
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true, nullsFirst: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return (data as InventoryItemRow[]).reduce((acc: InventoryItem[], row) => {
        try {
            // Filtrem negatius extrems, però acceptem 0
            if (Number(row.quantity) < 0) return acc;
            acc.push(this.toDomain(row));
        } catch (e) {
            console.warn(`Item ignorat: ${row.id} | ${row.name} | ${row.quantity} | ${e}`);
        }
        return acc;
    }, []);
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async findExpiringSoon(userId: string, daysThreshold: number): Promise<InventoryItem[]> {
    const supabase = await createClient();
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .lte('expiry_date', thresholdDate.toISOString())
      .gte('expiry_date', now.toISOString())
      .order('expiry_date', { ascending: true });

    if (error) throw new Error(error.message);

    return (data as InventoryItemRow[]).map(row => this.toDomain(row));
  }

  // Batch methods (opcionals segons la teva interfície)
  async batchUpdate(updates: { id: string; quantity: number }[]): Promise<void> {
    const supabase = await createClient();
    const promises = updates.map(update =>
      supabase.from('inventory_items').update({ quantity: update.quantity }).eq('id', update.id)
    );
    await Promise.all(promises);
  }

  async batchDelete(ids: string[]): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('inventory_items').delete().in('id', ids);
    if (error) throw new Error(error.message);
  }

  // ✅ NOU MÈTODE: Inserció Massiva
  async saveBatch(items: InventoryItem[]): Promise<void> {
    const supabase = await createClient();

    // Mapegem totes les entitats a files de la BD
    const rows = items.map(item => ({
      id: item.id,
      user_id: item.userId,
      name: item.name,
      emoji: item.emoji,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,
      expiry_date: item.expiryDate ? item.expiryDate.toISOString() : null,
      added_at: item.addedAt.toISOString()
    }));

    // Fem una única crida a Supabase
    const { error } = await supabase.from('inventory_items').insert(rows);

    if (error) {
      console.error('Error batch saving inventory items:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }
}