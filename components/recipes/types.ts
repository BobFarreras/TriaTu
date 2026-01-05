// src/components/recipes/types.ts

// Tipus per a la UI de l'inventari
export interface InventoryItemUI {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: Date;
}

// Estructura d'un ingredient dins la recepta
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

// ✅ DEFINICIÓ ESTRICTE D'UN PAS (Evitem 'any')
// Això et permetrà escalar (afegir imatges, timers, etc.) sense trencar res.
export interface RecipeStep {
  id: string;      // Identificador únic per a la gestió del DOM (keys)
  content: string; // El text de la instrucció
}

// Dades de l'editor
export interface EditorData {
  name: string;
  prepTimeMinutes: number;
  ingredients: Ingredient[];
  steps: RecipeStep[]; // ✅ Ara fem servir el tipus explícit
  dietaryTags: string[];
}

// Tipat per a les etiquetes de text (Labels)
export interface IngredientsLabels {
  title: string;
  selected: string;
  search_placeholder: string;
  category_all: string;
  empty_search: string;
  basket_title: string;
  basket_empty: string;
}