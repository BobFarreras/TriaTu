 // src/lib/food-presets/dairy.ts
 import { StorageLocation } from "@/core/domain/entities/StorageLocation";
 import { FoodPreset, DAYS } from "./types";
 
 export const CEREAL_PRESETS: FoodPreset[] = [
 
 // 🥖 CEREALS
  { id: 'c1', emoji: '🍞', name: 'Pa blanc', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.BAKERY },
  { id: 'c2', emoji: '🍞', name: 'Pa integral', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.BAKERY },
  { id: 'c3', emoji: '🍝', name: 'Pasta espagueti', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.PANTRY },
  { id: 'c4', emoji: '🍝', name: 'Pasta macarrons', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.PANTRY },
  { id: 'c5', emoji: '🍚', name: 'Arròs blanc', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.PANTRY },

  // Pa i brioixeria
  { id: 'c6', emoji: '🥖', name: 'Barra de pa', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.BAKERY },
  { id: 'c7', emoji: '🥐', name: 'Croissant', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.BAKERY },
  { id: 'c8', emoji: '🥯', name: 'Bagel', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 5 },
  { id: 'c9', emoji: '🍞', name: 'Pa de motlle', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 10 },

  // Pasta i derivats
  { id: 'c10', emoji: '🍝', name: 'Pasta fusilli', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.PANTRY },
  { id: 'c11', emoji: '🍝', name: 'Pasta penne', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.PANTRY },
  { id: 'c12', emoji: '🍜', name: 'Fideus', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.PANTRY },

  // Arròs i grans
  { id: 'c13', emoji: '🍚', name: 'Arròs integral', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.PANTRY },
  { id: 'c14', emoji: '🍚', name: 'Arròs basmati', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.PANTRY },
  { id: 'c15', emoji: '🍚', name: 'Arròs jazmín', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.PANTRY },
  { id: 'c16', emoji: '🌾', name: 'Cuscús', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.PANTRY },
  { id: 'c17', emoji: '🌾', name: 'Quinoa', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.PANTRY },

  // Esmorzar
  { id: 'c18', emoji: '🥣', name: 'Cereals d’esmorzar', category: '🥖 Cereals', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: 90 },
  { id: 'c19', emoji: '🥣', name: 'Flocs de civada', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: 90 },
  { id: 'c20', emoji: '🥣', name: 'Muesli', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: 90 },

  // Farines
  { id: 'c21', emoji: '🌾', name: 'Farina de blat', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 180 },
  { id: 'c22', emoji: '🌾', name: 'Farina integral', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 180 },
  { id: 'c23', emoji: '🌾', name: 'Farina de civada', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 180 },];