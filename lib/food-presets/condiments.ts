// src/lib/food-presets/condiments.ts
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FoodPreset, DAYS } from "./types";

export const CONDIMENT_PRESETS: FoodPreset[] = [
  { id: 'co1', emoji: '🫒', name: 'Oli d\'oliva verge', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co3', emoji: '🧂', name: 'Sal', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 500, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co4', emoji: '🧂', name: 'Pebre negre', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co5', emoji: '🍯', name: 'Vinagre de vi', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co9', emoji: '🍅', name: 'Quètxup', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },
  { id: 'co10', emoji: '🥚', name: 'Maionesa', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 30 },
  { id: 'co15', emoji: '🥘', name: 'Tomàquet fregit', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 400, expirationDays: 180 },
  // 🌿 Olis i vinagres
  { id: 'co16', emoji: '🫒', name: 'Oli de gira-sol', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co17', emoji: '🫒', name: 'Oli de coco', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 500, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co18', emoji: '🍯', name: 'Vinagre de poma', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co19', emoji: '🍯', name: 'Vinagre balsàmic', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.LONG_PANTRY },

  // 🧂 Espècies bàsiques
  { id: 'co20', emoji: '🌶️', name: 'Pebre blanc', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co21', emoji: '🌶️', name: 'Pebre vermell dolç', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co22', emoji: '🌶️', name: 'Pebre vermell picant', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co23', emoji: '🧄', name: 'All en pols', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co24', emoji: '🧅', name: 'Ceba en pols', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: DAYS.LONG_PANTRY },

  // 🌿 Herbes aromàtiques
  { id: 'co25', emoji: '🌿', name: 'Orenga', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 20, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co26', emoji: '🌿', name: 'Alfàbrega seca', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 20, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co27', emoji: '🌿', name: 'Farigola', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 20, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co28', emoji: '🌿', name: 'Romaní', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 20, expirationDays: DAYS.LONG_PANTRY },

  // 🥫 Salses
  { id: 'co29', emoji: '🥫', name: 'Mostassa', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },
  { id: 'co30', emoji: '🥫', name: 'Salsa barbacoa', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },
  { id: 'co31', emoji: '🥫', name: 'Salsa de soja', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co32', emoji: '🌶️', name: 'Salsa picant', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 365 },

  // 🍯 Altres
  { id: 'co33', emoji: '🍯', name: 'Sucre blanc', category: '🧂 Condiments', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co34', emoji: '🍯', name: 'Sucre morè', category: '🧂 Condiments', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.LONG_PANTRY },
  { id: 'co35', emoji: '🍯', name: 'Mel', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: DAYS.LONG_PANTRY },


];