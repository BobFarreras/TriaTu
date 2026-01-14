import { GroceryProvider, ScrapedProduct } from '@/core/ports/GroceryProvider';
import { BonpreuSearchResponse } from '@/experiments/bonpreu-types'; // Reutilitza els tipus
import { enrichProduct } from '@/experiments/product-mapper'; // Reutilitza el teu mapper màgic

export class BonpreuAdapter implements GroceryProvider {

  async search(query: string): Promise<ScrapedProduct[]> {
    const url = `https://www.compraonline.bonpreuesclat.cat/api/webproductpagews/v6/product-pages/search?includeAdditionalPageInfo=true&maxPageSize=20&maxProductsToDecorate=20&q=${query}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Compatible; MyDecisionApp/1.0)',
          // ... headers necessaris
        }
      });

      if (!response.ok) return [];

      const data = (await response.json()) as BonpreuSearchResponse;

      if (!data.productGroups) return [];

      return data.productGroups
        .filter(g => g.type === 'cluster')
        .flatMap(g => g.decoratedProducts)
        .map(raw => {
          // Usem el teu mapper existent per enriquir
          const enriched = enrichProduct(raw);

          // Retornem l'objecte net del domini
          return {
            externalId: enriched.id,
            name: enriched.name,
            price: parseFloat(enriched.price.replace('€', '')),
            image: enriched.image,
            url: `https://www.compraonline.bonpreuesclat.cat/products/${enriched.id}`,
            source: 'BONPREU',
            tags: enriched.tags.map(t => t.toUpperCase()), // Normalitzem
            emoji: enriched.emoji,
            quantityAmount: enriched.standardQuantity,
            quantityUnit: enriched.standardUnit,
          };
        });

    } catch (error) {
      console.error('Error fetching Bonpreu:', error);
      return [];
    }
  }
}