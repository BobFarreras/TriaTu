export interface ScannedItem {
  name: string;
  emoji?: string;
  quantity?: number;
  unit?: string;
  location?: 'PANTRY' | 'FRIDGE' | 'FREEZER';
  expiryDate?: string;
  box2d?: number[]; // [ymin, xmin, ymax, xmax]
  
  // ✅ CAMPS NOUS PER AL MATCHING
  productId?: string;      // ID real de la BBDD
  catalogImage?: string;   // Foto oficial del Bonpreu
  price?: number;          // Preu real
  matchConfidence?: number; // Com de segurs estem del match
}