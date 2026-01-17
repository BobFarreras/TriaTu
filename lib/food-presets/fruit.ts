// src/lib/food-presets/fruit.ts

import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FoodPreset, DAYS } from "./types";

export const FRUIT_PRESETS: FoodPreset[] = [
  { id: 'f1', emoji: '🍎', name: 'Poma vermella', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: DAYS.FRUIT },
  { id: 'f2', emoji: '🍏', name: 'Poma verda', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: DAYS.FRUIT },
  { id: 'f3', emoji: '🍎', name: 'Poma groga', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: DAYS.FRUIT },
  { id: 'f4', emoji: '🍌', name: 'Plàtan', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 7 },
  { id: 'f5', emoji: '🍌', name: 'Plàtan mascle', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 10 },
  { id: 'f6', emoji: '🍐', name: 'Pera conference', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: DAYS.FRUIT },
  { id: 'f7', emoji: '🍐', name: 'Pera blanquilla', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: DAYS.FRUIT },
  { id: 'f8', emoji: '🍊', name: 'Taronja', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.CITRUS },
  { id: 'f9', emoji: '🍊', name: 'Mandarina', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.CITRUS },
  { id: 'f10', emoji: '🍋', name: 'Llimona', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.CITRUS },
  { id: 'f11', emoji: '🍋', name: 'Llima', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.CITRUS },
  { id: 'f12', emoji: '🍊', name: 'Aranja', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.CITRUS },
  { id: 'f13', emoji: '🍓', name: 'Maduixa', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: DAYS.BERRIES },
  { id: 'f14', emoji: '🫐', name: 'Nabius', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: DAYS.BERRIES },
  { id: 'f15', emoji: '🍒', name: 'Cireres', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.2, expirationDays: DAYS.BERRIES },
  { id: 'f16', emoji: '🍇', name: 'Raïm blanc', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.1, expirationDays: 10 },
  { id: 'f17', emoji: '🍇', name: 'Raïm negre', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.1, expirationDays: 10 },
  { id: 'f18', emoji: '🍑', name: 'Préssec', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'f19', emoji: '🍑', name: 'Nectarina', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'f20', emoji: '🍑', name: 'Paraguaià', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'f21', emoji: '🍒', name: 'Pruna', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'f22', emoji: '🍒', name: 'Albercoc', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'f23', emoji: '🥝', name: 'Kiwi verd', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'f24', emoji: '🥝', name: 'Kiwi groc', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'f25', emoji: '🍍', name: 'Pinya', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'f26', emoji: '🥭', name: 'Mango', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'f27', emoji: '🍈', name: 'Meló', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 10 },
  { id: 'f28', emoji: '🍉', name: 'Síndria', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 10 },
  { id: 'f29', emoji: '🥥', name: 'Coco', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 20 },
  { id: 'f30', emoji: '🍎', name: 'Codony', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 30 },
  { id: 'f31', emoji: '🍎', name: 'Figa', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 'f32', emoji: '🍌', name: 'Dàtil fresc', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 30 },
  // Fruits tropicals
  { id: 'f33', emoji: '🍍', name: 'Papaia', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'f34', emoji: '🥭', name: 'Guaiaba', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'f35', emoji: '🍌', name: 'Plàtan vermell', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 7 },

  // Fruits del bosc (més)
  { id: 'f36', emoji: '🫐', name: 'Gerds', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: DAYS.BERRIES },
  { id: 'f37', emoji: '🫐', name: 'Mores', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: DAYS.BERRIES },
  { id: 'f38', emoji: '🍓', name: 'Fruita del bosc barrejada', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 250, expirationDays: DAYS.FROZEN },

  // Fruits secs / deshidratats
  { id: 'f39', emoji: '🍇', name: 'Panses', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: DAYS.LONG_PANTRY },
  { id: 'f40', emoji: '🍑', name: 'Albercocs secs', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: DAYS.LONG_PANTRY },
  { id: 'f41', emoji: '🍎', name: 'Poma deshidratada', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: DAYS.LONG_PANTRY },

  // Altres comuns
  { id: 'f42', emoji: '🍐', name: 'Caqui', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'f43', emoji: '🍊', name: 'Clementina', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.CITRUS },
  { id: 'f44', emoji: '🍋', name: 'Kumquat', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: DAYS.CITRUS },

];