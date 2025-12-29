import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation'; // Assegura't de la ruta correcta
import { createClient } from '@/adapters/supabase/server';

// ✅ DEFINIM EL DTO (Data Transfer Object)
// Aquest tipus representa exactament una fila de la base de dades.
// Ens serveix per fer el mapeig sense usar 'any'.
interface InventoryItemRow {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  expiry_date: string | null; // Supabase retorna dates com strings ISO
  added_at: string;
}

export class SupabaseInventoryRepository implements InventoryRepository {
  
  // --- MAPPER (Privat) ---
  // Converteix de Base de Dades -> Domini
  private toDomain(row: InventoryItemRow): InventoryItem {
    return InventoryItem.create({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      quantity: Number(row.quantity), // Postgres numeric pot venir com string de vegades
      unit: row.unit,
      location: row.location as StorageLocation, // Casting segur si confiem en la DB
      expiryDate: row.expiry_date ? new Date(row.expiry_date) : undefined,
      addedAt: new Date(row.added_at)
    });
  }

  // --- IMPLEMENTACIÓ DEL CONTRACTE ---

  async save(item: InventoryItem): Promise<void> {
    const supabase = await createClient();
    
    // Mapeig Domini -> Base de Dades
    const row = {
      id: item.props.id,
      user_id: item.props.userId,
      name: item.props.name,
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

    // Utilitzem el nostre tipus DTO per evitar 'any'
    return this.toDomain(data as InventoryItemRow);
  }

  async findByUser(userId: string): Promise<InventoryItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true, nullsFirst: false }); // Primer el que caduca

    if (error) throw new Error(error.message);

    return (data as InventoryItemRow[]).map(row => this.toDomain(row));
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async findExpiringSoon(userId: string, daysThreshold: number): Promise<InventoryItem[]> {
    const supabase = await createClient();
    
    // Calculem la data límit
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .lte('expiry_date', thresholdDate.toISOString()) // Less Than or Equal
      .gte('expiry_date', now.toISOString())         // Greater Than or Equal (no volem els ja caducats, o sí?)
      .order('expiry_date', { ascending: true });

    if (error) throw new Error(error.message);

    return (data as InventoryItemRow[]).map(row => this.toDomain(row));
  }
}