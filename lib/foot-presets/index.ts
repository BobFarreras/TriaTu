// src/lib/food-presets/index.ts
import { FoodPreset, FoodCategory } from "./types";
import { FRUIT_PRESETS } from "./fruit";
import { VEGETABLE_PRESETS } from "./vegetables";
import { PROTEIN_PRESETS } from "./protein";
import { DAIRY_PRESETS } from "./dairy";
import { CEREAL_PRESETS } from "./cereals";
import { DRINK_PRESETS } from "./drinks";
import { SNACK_PRESETS } from "./snacks";
import { CONDIMENT_PRESETS } from "./condiments";

export * from "./types";

export const FOOD_PRESETS: FoodPreset[] = [
  ...FRUIT_PRESETS,
  ...VEGETABLE_PRESETS,
  ...PROTEIN_PRESETS,
  ...DAIRY_PRESETS,
  ...CEREAL_PRESETS,
  ...DRINK_PRESETS,
  ...SNACK_PRESETS,
  ...CONDIMENT_PRESETS,
];

export const PRESET_CATEGORIES: FoodCategory[] = Array.from(
  new Set(FOOD_PRESETS.map(p => p.category))
) as FoodCategory[];