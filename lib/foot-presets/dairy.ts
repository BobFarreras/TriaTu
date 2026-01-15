// src/lib/food-presets/dairy.ts
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FoodPreset, DAYS } from "./types";

export const DAIRY_PRESETS: FoodPreset[] = [
  { id: 'l1', emoji: '🥛', name: 'Llet sencera', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 'l2', emoji: '🥛', name: 'Llet semi', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 'l3', emoji: '🥛', name: 'Llet desnatada', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 'l4', emoji: '🥛', name: 'Llet sense lactosa', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 'l5', emoji: '🧀', name: 'Formatge curat', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 60 },
  { id: 'l6', emoji: '🧀', name: 'Formatge semicurat', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 45 },
  { id: 'l7', emoji: '🧀', name: 'Formatge tendre', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 10 },
  { id: 'l8', emoji: '🧀', name: 'Formatge ratllat', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 14 },
  { id: 'l9', emoji: '🧀', name: 'Mozzarella', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'l10', emoji: '🧀', name: 'Formatge parmesà', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 90 },
  { id: 'l11', emoji: '🧀', name: 'Formatge fresc', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 'l12', emoji: '🧀', name: 'Formatge blau', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 20 },
  { id: 'l13', emoji: '🥣', name: 'Iogurt natural', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 20 },
  { id: 'l14', emoji: '🥣', name: 'Iogurt grec', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 20 },
  { id: 'l15', emoji: '🥣', name: 'Iogurt de maduixa', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 20 },
  { id: 'l16', emoji: '🍮', name: 'Flam', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 20 },
  { id: 'l17', emoji: '🍮', name: 'Natilles', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 20 },
  { id: 'l18', emoji: '🧈', name: 'Mantega', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 90 },
  { id: 'l19', emoji: '🧴', name: 'Nata per cuinar', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 200, expirationDays: 30 },
  { id: 'l20', emoji: '🍦', name: 'Gelat', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FREEZER, step: 1, expirationDays: DAYS.FROZEN },
];