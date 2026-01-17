// src/lib/food-presets/types.ts

import { StorageLocation } from "@/core/domain/entities/StorageLocation";

export type FoodCategory =
  | '🥩 Proteïna'
  | '🥦 Verdura'
  | '🍎 Fruita'
  | '🥛 Lactic'
  | '🥖 Cereals'
  | '🥤 Beguda'
  | '🍪 Snack'
  | '🧂 Condiments';

export type FoodPreset = {
  id: string;
  emoji: string;
  name: string;
  category: FoodCategory;
  defaultUnit: 'ut' | 'kg' | 'l' | 'g';
  defaultLoc: StorageLocation;
  step: number; 
  expirationDays: number;
};

export const DAYS = {
  FRESH_MEAT: 4,
  FRESH_FISH: 3,
  FRUIT: 14,
  BERRIES: 7,
  CITRUS: 30,
  VEGGIE: 12,
  ROOTS: 45,
  LEAFY: 7,
  DAIRY: 60,
  CHEESE: 30,
  PANTRY: 180,
  LONG_PANTRY: 665,
  FROZEN: 365,
  BAKERY: 3
};