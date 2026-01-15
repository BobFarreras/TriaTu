import { FRUIT_CATEGORY } from './fruit';
import { VEGETABLES_CATEGORY } from './vegetables';
import { MEAT_CATEGORY } from './meat';
import { FISH_CATEGORY } from './fish';
import { DAIRY_CATEGORY } from './dairy';
import { CHARCUTERIE_CATEGORY } from './charcuterie';
import { PANTRY_CATEGORY } from './pantry';
import { FROZEN_CATEGORY } from './frozen';
import { DRINKS_CATEGORY } from './drinks';
import { DIETARY_CATEGORY } from './dietary';
import { HOUSEHOLD_CATEGORY } from './household';

export * from './types';

// Ordre d'aparició a l'App
export const FOOD_TAXONOMY = [
  FRUIT_CATEGORY,
  VEGETABLES_CATEGORY,
  MEAT_CATEGORY,
  FISH_CATEGORY,
  DAIRY_CATEGORY,
  CHARCUTERIE_CATEGORY,
  PANTRY_CATEGORY,
  FROZEN_CATEGORY,
  DRINKS_CATEGORY,
  DIETARY_CATEGORY,
  HOUSEHOLD_CATEGORY
];