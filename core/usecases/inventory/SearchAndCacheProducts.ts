// src/core/usecases/inventory/SearchAndCacheProducts.ts
import { GroceryProvider } from '@/core/ports/GroceryProvider';
import { ProductCatalogRepository } from '@/core/ports/ProductCatalogRepository';
import { Product } from '@/core/domain/entities/Product';

export class SearchAndCacheProducts {
  constructor(
    private provider: GroceryProvider,
    private catalogRepo: ProductCatalogRepository
  ) { }

  async execute(query: string): Promise<Product[]> {

    // 1. Cache
    const cachedProducts = await this.catalogRepo.searchByName(query);
    if (cachedProducts.length > 0) {
      console.log("⚡️ Retornant de Cache DB");
      return cachedProducts;
    }

    // 2. Scraper
    console.log("🐢 Buscant a Bonpreu API...");
    const scrapedItems = await this.provider.search(query);

    // 3. Preparem entitats (amb IDs temporals que seran ignorats)
    const itemsToSave = scrapedItems.map(item => {
      // LOG 4: Comprovem que arriba al UseCase
      console.log("🧠 [USECASE] Processing:", item.name, item.quantityAmount, item.quantityUnit);

      return new Product({
        id: crypto.randomUUID(),
        externalId: item.externalId,
        name: item.name,
        price: item.price,
        currency: 'EUR',
        image: item.image,
        url: item.url,
        source: item.source,
        tags: item.tags,
        emoji: item.emoji,
        lastUpdated: new Date(),
        // ✅ AQUESTES DUES LÍNIES SÓN CRÍTIQUES:
        quantityAmount: item.quantityAmount,
        quantityUnit: item.quantityUnit
      });
    });

    // 4. Guardem i RECUPEREM els IDs reals
    if (itemsToSave.length > 0) {
      // ✅ ARA: savedProducts té els IDs de veritat
      const savedProducts = await this.catalogRepo.saveBatch(itemsToSave);
      return savedProducts;
    }

    return [];
  }
}