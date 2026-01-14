// ARXIU: adapters/supabase/SupabaseInventoryRepository.ts

import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { SupabaseClient } from '@supabase/supabase-js';

// DTO: La forma exacta de la taula a Supabase
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

// Helper pur per separar emojis (Molt bona lògica!)
function splitEmoji(text: string): { emoji: string | undefined; name: string } {
  const regex = /^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*/;
  const match = text.match(regex);
  if (match) {
    return { emoji: match[1], name: text.replace(match[0], '').trim() };
  }
  return { emoji: undefined, name: text.trim() };
}

export class SupabaseInventoryRepository implements InventoryRepository {
  // ✅ CLAU: Injectem el client. Això fa feliç al TDD.
  constructor(private readonly supabase: SupabaseClient) { }

  // --- Mapper Privat ---
  private toDomain(row: InventoryItemRow): InventoryItem {
    let finalEmoji = row.emoji;
    let finalName = row.name;

    if (!finalEmoji && finalName) {
      const separated = splitEmoji(finalName);
      if (separated.emoji) {
        finalEmoji = separated.emoji;
        finalName = separated.name;
      }
    }

    // ✅ SOLUCIÓ SENSE ANY: Comprovem si el string està dins els valors de l'Enum
    const isValidLocation = Object.values(StorageLocation).includes(row.location as StorageLocation);

    // Si és vàlid, fem cast segur. Si no, fallback a PANTRY.
    const location: StorageLocation = isValidLocation
      ? (row.location as StorageLocation)
      : StorageLocation.PANTRY;

    return InventoryItem.create({
      id: row.id,
      userId: row.user_id,
      name: finalName,
      emoji: finalEmoji || undefined,
      quantity: Number(row.quantity),
      unit: row.unit,
      location: location,
      expiryDate: row.expiry_date ? new Date(row.expiry_date) : undefined,
      addedAt: new Date(row.added_at)
    });
  }

  // --- Implementació del Port ---

  async save(item: InventoryItem): Promise<void> {
    const row = {
      id: item.id,
      user_id: item.userId,
      name: item.name,
      emoji: item.emoji, // Guardem l'emoji net
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,
      expiry_date: item.expiryDate ? item.expiryDate.toISOString() : null,
      added_at: item.addedAt.toISOString() // Important: assegurar format ISO
    };

    const { error } = await this.supabase.from('inventory_items').upsert(row);

    if (error) {
      console.error('Error saving inventory item:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Codi específic de Supabase/Postgres per "No trobat"
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    if (!data) return null;
    return this.toDomain(data as InventoryItemRow);
  }

  async findByUser(userId: string): Promise<InventoryItem[]> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true, nullsFirst: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    // Map segur ignorant errors de dades corruptes
    return (data as InventoryItemRow[]).reduce((acc: InventoryItem[], row) => {
      try {
        acc.push(this.toDomain(row));
      } catch (e) {
        console.warn(`⚠️ Inventari corrupt ignorat (ID: ${row.id}):`, e);
      }
      return acc;
    }, []);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('inventory_items').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async findExpiringSoon(userId: string, daysThreshold: number): Promise<InventoryItem[]> {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .lte('expiry_date', thresholdDate.toISOString())
      .gte('expiry_date', now.toISOString()) // Opcional: per no mostrar els ja caducats
      .order('expiry_date', { ascending: true });

    if (error) throw new Error(error.message);

    return (data as InventoryItemRow[]).map(row => this.toDomain(row));
  }

  async batchUpdate(updates: { id: string; quantity: number }[]): Promise<void> {
    // Nota: Supabase no té un "update many" natiu amb valors diferents per fila fàcil.
    // L'estratègia de Promise.all és correcta per volums baixos (<50 items).
    const promises = updates.map(update =>
      this.supabase.from('inventory_items').update({ quantity: update.quantity }).eq('id', update.id)
    );
    await Promise.all(promises);
  }

  async batchDelete(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase.from('inventory_items').delete().in('id', ids);
    if (error) throw new Error(error.message);
  }

  // Si vols utilitzar aquest mètode, recorda afegir-lo a la interfície InventoryRepository
  async saveBatch(items: InventoryItem[]): Promise<void> {
    if (items.length === 0) return;

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

    const { error } = await this.supabase.from('inventory_items').upsert(rows);

    if (error) {
      console.error('Error batch saving items:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }
}