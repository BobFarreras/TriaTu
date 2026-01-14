// src/core/ports/ProductCatalogRepository.ts
import { Product } from "@/core/domain/entities/Product";

export interface ProductCatalogRepository {
  /**
   * Guarda o actualitza una llista de productes (Upsert).
   * Si el producte ja existeix (pel seu externalId + source), actualitza el preu.
   */
  saveBatch(products: Product[]): Promise<Product[]>;

  /**
   * Busca productes al nostre catàleg local pel nom.
   */
  searchByName(query: string): Promise<Product[]>;

  /**
   * Busca un producte concret pel seu ID extern (per evitar duplicats).
   */
  findByExternalId(externalId: string, source: string): Promise<Product | null>;
}