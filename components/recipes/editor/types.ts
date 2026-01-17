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

// ✅ NOVA INTERFÍCIE D'INGREDIENT (ACTUALITZADA)
export interface Ingredient {
  id: string;
  name: string;       // Ex: "Pit de pollastre"
  quantity: number;   // Ex: 500
  unit: string;       // Ex: "g"

  // Camps opcionals visuals
  emoji?: string;     // Ex: "🍗" (Si és genèric)
  image?: string; // ✅ AFEGEIX AQUESTA LÍNIA (amb ? perquè és opcional)
  // 🔥 NOUS CAMPS: Enllaç amb Bonpreu (Opcional)
  linkedProductId?: string;      // ID extern del producte
  linkedProductImage?: string;   // URL de la foto real
  referencePrice?: number;       // Preu del paquet (Ex: 5.99)
  estimatedCost?: number;        // Cost calculat per a la recepta (Ex: 2.50)
}

export interface RecipeStep {
  id: string;
  content: string;
}

export interface RecipeStep {
  id: string;
  content: string;
}

export interface EditorData {
  id?: string; // ✅ FIX: Afegim l'ID opcional per suportar l'Edició
  name: string;
  description: string;
  prepTimeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  dietaryTags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  isAiGenerated?: boolean;
}

export interface IngredientsLabels {
  title: string;
  selected: string;
  search_placeholder: string;
  category_all: string;
  empty_search: string;
  basket_title: string;
  basket_empty: string;
  search_placeholder_recipe: string; // Nou label per l'input
}

export interface StepsLabels {
  title: string;
  placeholder: string;
  new_step_title: string;
  new_step_desc: string;
  empty_state: string;
  [key: string]: string;
}