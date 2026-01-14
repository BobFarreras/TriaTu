// src/experiments/bonpreu-types.ts

export interface BonpreuIconAttribute {
  label: string;
  file: string;
}

export interface BonpreuProductRaw {
  productId: string;
  name: string;
  price: {
    amount: string;
    currency: string;
  };
  image: {
    src: string;
  };
  // Aquest camp és important pel mapper
  iconAttributes?: BonpreuIconAttribute[]; 
  packSizeDescription?: string; // "150g", "1L", etc.
}

export interface BonpreuCluster {
  type: string;
  decoratedProducts: BonpreuProductRaw[];
}

export interface BonpreuSearchResponse {
  productGroups: BonpreuCluster[];
}