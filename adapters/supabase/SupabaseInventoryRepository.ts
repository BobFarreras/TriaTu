import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { createClient } from '@/adapters/supabase/server';

// DTO actualitzat amb el camp emoji (que pot ser null a la DB)
interface InventoryItemRow {
  id: string;
  user_id: string;
  name: string;
  emoji: string | null; // ✅ AFEGIT
  quantity: number;
  unit: string;
  location: string;
  expiry_date: string | null;
  added_at: string;
}

// Funció Helper per separar l'emoji del text (retrocompatibilitat)
// Funció Helper per separar l'emoji del text (Versió compatible ES5/ES6)
function splitEmoji(text: string): { emoji: string | undefined; name: string } {
  // Regex compatible que busca rangs Unicode d'emojis comuns sense usar \p
  const regex = /^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*/;
  
  const match = text.match(regex);
  
  if (match) {
    return { 
      emoji: match[1], 
      name: text.replace(match[0], '').trim() 
    };
  }
  return { emoji: undefined, name: text.trim() };
}

export class SupabaseInventoryRepository implements InventoryRepository {

  // --- MAPPER INTEL·LIGENT ---
  private toDomain(row: InventoryItemRow): InventoryItem {
    let finalEmoji = row.emoji;
    let finalName = row.name;

    // 🛠️ MIGRACIÓ AUTOMÀTICA AL VOL:
    // Si no tenim emoji a la columna 'emoji', però el nom en té un enganxat...
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
      name: finalName,   // Nom net
      emoji: finalEmoji || undefined, // Emoji separat (o undefined si no en té)
      quantity: Number(row.quantity),
      unit: row.unit,
      location: row.location as StorageLocation,
      expiryDate: row.expiry_date ? new Date(row.expiry_date) : undefined,
      addedAt: new Date(row.added_at)
    });
  }

  // --- IMPLEMENTACIÓ DEL CONTRACTE ---

  async save(item: InventoryItem): Promise<void> {
    const supabase = await createClient();

    const row = {
      id: item.props.id,
      user_id: item.props.userId,
      name: item.props.name,
      emoji: item.props.emoji, // ✅ Ara guardem l'emoji a la seva columna
      quantity: item.props.quantity,
      unit: item.props.unit,
      location: item.props.location,
      expiry_date: item.props.expiryDate ? item.props.expiryDate.toISOString() : null,
      added_at: item.props.addedAt.toISOString()
    };

    const { error } = await supabase
      .from('inventory_items')
      .upsert(row);

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

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true, nullsFirst: false });

    if (error) throw new Error(error.message);

    return (data as InventoryItemRow[]).map(row => this.toDomain(row));
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

  async batchUpdate(updates: { id: string; quantity: number }[]): Promise<void> {
    const supabase = await createClient();
    const promises = updates.map(update =>
      supabase
        .from('inventory_items')
        .update({ quantity: update.quantity })
        .eq('id', update.id)
    );
    await Promise.all(promises);
  }

  async batchDelete(ids: string[]): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
  }
}