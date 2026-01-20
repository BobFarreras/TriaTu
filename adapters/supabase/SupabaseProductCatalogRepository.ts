import { SupabaseClient } from '@supabase/supabase-js';
import { ProductCatalogRepository } from '@/core/ports/ProductCatalogRepository';
import { Product } from '@/core/domain/entities/Product';
import { debug, error as logError } from '@/lib/logger';

// ✅ DEFINIM LA FORMA DE LA BASE DE DADES (DTO Intern)
// Això ens permet treure el 'any' del mètode mapToEntity
interface ProductTableRow {
  id: string;
  external_id: string;
  name: string;
  price: number;
  image_url: string;
  source: string;
  tags: string[] | null; // Supabase pot retornar null si està buit
  emoji: string;
  last_fetched_at: string;
}

export class SupabaseProductCatalogRepository implements ProductCatalogRepository {
  constructor(private client: SupabaseClient) { }

  // 🔄 ACTUALITZAT
  async saveBatch(products: Product[]): Promise<Product[]> {
    if (products.length === 0) return [];

    const rows = products.map(p => {
      const row = {
        external_id: p.props.externalId,
        source: p.props.source,
        name: p.props.name,
        price: p.props.price,
        image_url: p.props.image,
        tags: p.props.tags,
        emoji: p.props.emoji,
        // ✅ ASSEGURA'T QUE LES COLUMNES COINCIDEIXEN AMB SQL:
        quantity_amount: p.props.quantityAmount,
        quantity_unit: p.props.quantityUnit,

        last_fetched_at: new Date().toISOString()
      };

      // LOG 5: El payload final
      console.log("💾 [REPO] Saving Row:", row.quantity_amount, row.quantity_unit);
      return row;
    });

    // 🚀 CLAU: upsert(...).select()
    const { data, error } = await this.client
      .from('product_catalog')
      .upsert(rows, {
        onConflict: 'external_id, source',
        ignoreDuplicates: false
      })
      .select(); // <--- Això ens retorna les files guardades amb l'ID REAL

    if (error) {
      console.error("Error guardant catàleg:", error);
      throw new Error(`Error saving product catalog: ${error.message}`);
    }

    if (!data) return [];

    // Retornem les entitats amb l'ID correcte de la BD
    return (data as unknown as ProductTableRow[]).map(row => this.mapToEntity(row));
  }

  async searchByName(query: string): Promise<Product[]> {
    const { data, error } = await this.client
      .from('product_catalog')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);

    if (error) throw new Error(error.message);
    if (!data) return [];

    // ✅ Fem un cast segur perquè sabem que Supabase retorna aquesta estructura
    return (data as unknown as ProductTableRow[]).map(row => this.mapToEntity(row));
  }

  async findByExternalId(externalId: string, source: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('product_catalog')
      .select('*')
      .eq('external_id', externalId)
      .eq('source', source)
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data as unknown as ProductTableRow);
  }

  // ✅ FIX: Ara acceptem el tipus definit, adéu 'any'!
  private mapToEntity(row: ProductTableRow): Product {
    return new Product({
      id: row.id,
      externalId: row.external_id,
      name: row.name,
      price: row.price,
      currency: 'EUR',
      image: row.image_url,
      url: '',
      source: row.source,
      tags: row.tags || [], // Protecció contra nulls
      emoji: row.emoji,
      lastUpdated: new Date(row.last_fetched_at)
    });
  }
}