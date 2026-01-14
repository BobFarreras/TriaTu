// Aquest és el llenguatge universal de la teva app (no sap res de JSONs estranys)
export interface ScrapedProduct {
  externalId: string;
  name: string;
  price: number;
  image: string;
  url: string;
  source: 'BONPREU' | 'MERCADONA';
  tags: string[]; // 'VEGAN', 'GLUTEN_FREE'
  emoji: string;
  quantityAmount?: number;
  quantityUnit?: string;
}

export interface GroceryProvider {
  search(query: string): Promise<ScrapedProduct[]>;
}