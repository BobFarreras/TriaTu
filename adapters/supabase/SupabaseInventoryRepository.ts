import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { SupabaseClient } from '@supabase/supabase-js';

// ✅ 1. INTERFÍCIE ROBUSTA PER AL JOIN
// Definim exactament què ens retorna Supabase
interface InventoryItemRow {
  id: string;
  user_id: string;
  room_id?: string | null; // <--- NOVA COLUMNA
  name: string;
  emoji: string | null;
  quantity: number;
  unit: string;
  location: string;
  expiry_date: string | null;
  added_at: string;
  product_id: string | null;

  // Camps "legacy" que podrien existir a la taula principal
  image?: string | null;
  image_url?: string | null;

  // El JOIN amb el catàleg
  product_catalog: {
    image_url: string | null;
    price: number | null;
    emoji: string | null;
  } | null;
}

// Helper pur per separar emojis del text
function splitEmoji(text: string): { emoji: string | undefined; name: string } {
  const regex = /^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*/;
  const match = text.match(regex);
  if (match) {
    return { emoji: match[1], name: text.replace(match[0], '').trim() };
  }
  return { emoji: undefined, name: text.trim() };
}

export class SupabaseInventoryRepository implements InventoryRepository {
  // ✅ CORRECCIÓ: Fem servir 'supabase' consistentment
  constructor(private readonly supabase: SupabaseClient) { }

  // 🔥 CENTRE DE TRANSFORMACIÓ 🔥
  // Tota la lògica de neteja d'imatges i preus va aquí perquè tots els mètodes la usin.
  private toDomain(row: InventoryItemRow): InventoryItem {
    let finalEmoji = row.emoji;
    let finalName = row.name;

    // 1. EMOJI: Extracció del nom si falta
    if (!finalEmoji && finalName) {
      const separated = splitEmoji(finalName);
      if (separated.emoji) {
        finalEmoji = separated.emoji;
        finalName = separated.name;
      }
    }

    // 2. EMOJI: Prioritat del catàleg (sol ser de més qualitat)
    if (row.product_catalog?.emoji) {
      finalEmoji = row.product_catalog.emoji;
    }

    // 3. LOCATION: Validació
    const isValidLocation = Object.values(StorageLocation).includes(row.location as StorageLocation);
    const location: StorageLocation = isValidLocation
      ? (row.location as StorageLocation)
      : StorageLocation.PANTRY;

    // 4. IMATGE: Lògica de prioritat i neteja
    // Prioritat: Catàleg > Columna image_url > Columna image
    const catalogImage = row.product_catalog?.image_url;
    const directImage = row.image_url || row.image;

    let finalImage = catalogImage || directImage || null;

    // Neteja: Evitem "Sí", "No" o strings que no siguin URLs
    if (finalImage && !finalImage.startsWith('http')) {
      finalImage = null;
    }

    // 5. PREU
    const price = row.product_catalog?.price ? Number(row.product_catalog.price) : undefined;

    // ✅ CORRECCIÓ: Usem .create() perquè el constructor és privat
    return InventoryItem.create({
      id: row.id,
      userId: row.user_id,
      roomId: row.room_id || undefined, // <--- MAPEGEM EL CONTEXT
      name: finalName,
      emoji: finalEmoji || undefined,
      quantity: Number(row.quantity),
      unit: row.unit,
      location: location,
      expiryDate: row.expiry_date ? new Date(row.expiry_date) : undefined,
      addedAt: new Date(row.added_at),
      productId: row.product_id || undefined,
      image: finalImage || undefined, // Passem la imatge neta
      price: price
    });
  }

  async save(item: InventoryItem): Promise<void> {
    const row = {
      id: item.props.id,
      user_id: item.props.userId,
      room_id: item.props.roomId || null, // <--- GUARDEM EL CONTEXT TAMBÉ AQUÍ
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
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    if (!data) return null;

    return this.toDomain(data as unknown as InventoryItemRow);
  }

  // 🔍 CERCA PER CONTEXT (Usuari o Sala)
  async findByContext(userId: string, roomId?: string): Promise<InventoryItem[]> {
    let query = this.supabase
      .from('inventory_items')
      .select(`
        *,
        product_catalog (
            image_url,
            price,
            emoji
        )
      `);

    if (roomId) {
      // MODE SALA: Filtrem per la sala
      console.log(`📦 [Repo] Fetching ROOM inventory: ${roomId}`);
      query = query.eq('room_id', roomId);
    } else {
      // MODE PERSONAL: Filtrem per usuari I que NO tingui sala
      console.log(`👤 [Repo] Fetching PERSONAL inventory: ${userId}`);
      query = query.eq('user_id', userId).is('room_id', null);
    }

    // Ordenació per defecte
    query = query.order('expiry_date', { ascending: true, nullsFirst: false });

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    if (!data) return [];

    const rows = data as unknown as InventoryItemRow[];
    return rows.map(row => this.toDomain(row));
  }

  // (Opcional) Wrapper de compatibilitat si no vols canviar tot el codi de cop
  // async findByUser(userId: string): Promise<InventoryItem[]> {
  //    return this.findByContext(userId);
  // }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('inventory_items').delete().eq('id', id);
    if (error) throw new Error(error.message);
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
      room_id: item.props.roomId || null, // <--- GUARDEM EL CONTEXT TAMBÉ AQUÍ
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
  async findExpiringSoon(userId: string, daysThreshold: number, roomId?: string): Promise<InventoryItem[]> {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    let query = this.supabase
      .from('inventory_items')
      .select(`
        *,
        product_catalog ( image_url, price, emoji ) 
      `)
      .lte('expiry_date', thresholdDate.toISOString())
      .gte('expiry_date', now.toISOString())
      .order('expiry_date', { ascending: true });

    if (roomId) {
      query = query.eq('room_id', roomId);
    } else {
      query = query.eq('user_id', userId).is('room_id', null);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const rows = data as unknown as InventoryItemRow[];
    return rows.map(row => this.toDomain(row));
  }
}
