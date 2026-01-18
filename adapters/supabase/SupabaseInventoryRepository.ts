import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { SupabaseClient } from '@supabase/supabase-js';

// ✅ 1. INTERFÍCIE ACTUALITZADA (Amb Preu)
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
  product_id: string | null;
  
  // 🔥 AFEGIM EL PREU AL JOIN
  product_catalog: {
    image_url: string | null;
    price: number | null; // <--- NOU
    emoji: string | null; // <--- NOU (Opcional, per si el catàleg té millor emoji)
  } | null; 
}

// Helper pur per separar emojis
function splitEmoji(text: string): { emoji: string | undefined; name: string } {
  const regex = /^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*/;
  const match = text.match(regex);
  if (match) {
    return { emoji: match[1], name: text.replace(match[0], '').trim() };
  }
  return { emoji: undefined, name: text.trim() };
}

export class SupabaseInventoryRepository implements InventoryRepository {
  constructor(private readonly supabase: SupabaseClient) { }

  private toDomain(row: InventoryItemRow): InventoryItem {
    let finalEmoji = row.emoji;
    let finalName = row.name;

    // Si no té emoji, intentem treure'l del nom
    if (!finalEmoji && finalName) {
      const separated = splitEmoji(finalName);
      if (separated.emoji) {
        finalEmoji = separated.emoji;
        finalName = separated.name;
      }
    }

    // 🔥 PREFERÈNCIA: Si el catàleg té emoji, el fem servir
    if (row.product_catalog?.emoji) {
        finalEmoji = row.product_catalog.emoji;
    }

    const isValidLocation = Object.values(StorageLocation).includes(row.location as StorageLocation);
    const location: StorageLocation = isValidLocation
      ? (row.location as StorageLocation)
      : StorageLocation.PANTRY;

    const imageUrl = row.product_catalog?.image_url || null;
    
    // 🔥 RECUPEREM EL PREU
    const price = row.product_catalog?.price ? Number(row.product_catalog.price) : undefined;

    return InventoryItem.create({
      id: row.id,
      userId: row.user_id,
      name: finalName,
      emoji: finalEmoji || undefined,
      quantity: Number(row.quantity),
      unit: row.unit,
      location: location,
      expiryDate: row.expiry_date ? new Date(row.expiry_date) : undefined,
      addedAt: new Date(row.added_at),
      productId: row.product_id || undefined,
      image: imageUrl!,
      price: price // ✅ Assignem el preu a l'entitat
    });
  }

  async save(item: InventoryItem): Promise<void> {
    const row = {
      id: item.props.id,
      user_id: item.props.userId,
      name: item.props.name,
      emoji: item.props.emoji,
      quantity: item.props.quantity,
      unit: item.props.unit,
      location: item.props.location,
      expiry_date: item.props.expiryDate ? item.props.expiryDate.toISOString() : null,
      added_at: item.props.addedAt.toISOString(),
      product_id: item.props.productId 
    };
    
    const { error } = await this.supabase.from('inventory_items').upsert(row);
    if (error) throw new Error(`Database error: ${error.message}`);
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select(`
        *,
        product_catalog ( image_url, price, emoji )
      `) // ✅ Afegim JOIN aquí també per consistència
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    if (!data) return null;
    
    return this.toDomain(data as unknown as InventoryItemRow);
  }

  // 🔥 MÈTODE CRÍTIC ARREGLAT 🔥
  async findByUser(userId: string): Promise<InventoryItem[]> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select(`
        *,
        product_catalog (
            image_url,
            price,  
            emoji
        )
      `) // ✅ SELECT COMPLET
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true, nullsFirst: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    const rows = data as unknown as InventoryItemRow[];
    return rows.map(row => this.toDomain(row));
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
      .select(`
        *,
        product_catalog ( image_url, price, emoji ) 
      `) // ✅ SELECT COMPLET
      .eq('user_id', userId)
      .lte('expiry_date', thresholdDate.toISOString())
      .gte('expiry_date', now.toISOString())
      .order('expiry_date', { ascending: true });

    if (error) throw new Error(error.message);

    const rows = data as unknown as InventoryItemRow[];
    return rows.map(row => this.toDomain(row));
  }

  async batchUpdate(updates: { id: string; quantity: number }[]): Promise<void> {
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

  async saveBatch(items: InventoryItem[]): Promise<void> {
    if (items.length === 0) return;

    const rows = items.map(item => ({
      id: item.props.id,
      user_id: item.props.userId,
      name: item.props.name,
      emoji: item.props.emoji,
      quantity: item.props.quantity,
      unit: item.props.unit,
      location: item.props.location,
      expiry_date: item.props.expiryDate ? item.props.expiryDate.toISOString() : null,
      added_at: item.props.addedAt.toISOString(),
      product_id: item.props.productId
    }));

    const { error } = await this.supabase.from('inventory_items').upsert(rows);

    if (error) {
      console.error('Error batch saving items:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }
}