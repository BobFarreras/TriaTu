// ARXIU: components/recipes/editor/types.ts

export interface IngredientRow {
  name: string;
  quantity: number;
  unit: string;
}

export interface EditorData {
  name: string;
  prepTimeMinutes: number;
  ingredients: IngredientRow[];
  steps: string[];
  dietaryTags: string[];
}

export interface InventoryItemUI {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  emoji?: string | null; // Pot ser null si ve de la BD sense emoji
}