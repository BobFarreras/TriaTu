import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ProductCatalogRepository } from '@/core/ports/ProductCatalogRepository';
import { debug } from '@/lib/logger';

export class ProductMatcherService {
  constructor(private catalogRepo: ProductCatalogRepository) {}

  /**
   * Rep una llista d'items generics i intenta trobar el producte real al cataleg.
   */
  async enrichItems(items: ScannedItem[]): Promise<ScannedItem[]> {
    const promises = items.map(async (item) => {
      if (!item.name) return item;

      const matches = await this.catalogRepo.searchByName(item.name);
      if (!matches || matches.length === 0) {
        debug('[Matcher] no match');
        return item;
      }

      const match = matches[0];
      debug('[Matcher] match found');

      return {
        ...item,
        name: match.name,
        productId: match.id,
        catalogImage: match.props.image,
        price: Number(match.price),
        matchConfidence: 1.0
      };
    });

    return Promise.all(promises);
  }
}
