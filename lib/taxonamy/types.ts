export interface SubCategory {
  id: string;
  label: string;
  emoji: string;
  query: string; // El text que enviem a l'API de Bonpreu
}

export interface MainCategory {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  subcategories: SubCategory[];
}