// src/lib/taxonomy/types.ts

export interface SubCategory {
  id: string;
  label: string;
  emoji: string;
  query: string | string[];
  exclude?: string[];
  // ✅ NOU: El nom del producte HA de tenir alguna d'aquestes paraules.
  // Si no la té, el descartem immediatament.
  mustContain?: string | string[]; 
}

// ... (resta igual)
export interface MainCategory {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  subcategories: SubCategory[];
}