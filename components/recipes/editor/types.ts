// src/components/recipes/editor/types.ts

import { StorageLocation } from "@/core/domain/entities/StorageLocation";

// ✅ 1. CORRECCIÓ: Fem servir string en lloc d'any.
// La UI tractarà les categories com a text simple.
export type FoodCategory = string;

export interface FoodPreset {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  // ✅ 2. CORRECCIÓ: La UI accepta qualsevol string com a unitat.
  // El pont amb el tipus estricte el farem al component pare.
  defaultUnit: string; 
  defaultLoc?: StorageLocation;
  // ✅ 3. CORRECCIÓ: Afegim 'step' que faltava
  step: number;
}

export interface InventoryItemUI {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: Date;
  emoji?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: Date;
  emoji?: string;
}

export interface RecipeStep {
  id: string;
  content: string;
}

export interface EditorData {
  name: string;
  prepTimeMinutes: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  dietaryTags: string[];
}

export interface IngredientsLabels {
  title: string;
  selected: string;
  search_placeholder: string;
  category_all: string;
  empty_search: string;
  basket_title: string;
  basket_empty: string;
}

// ✅ 3. CORRECCIÓN: Añadida la interfaz StepsLabels que faltaba
export interface StepsLabels {
  title: string;
  placeholder: string;
  new_step_title: string;
  new_step_desc: string;
  empty_state: string;
  [key: string]: string; // Índice para permitir claves dinámicas si es necesario
}