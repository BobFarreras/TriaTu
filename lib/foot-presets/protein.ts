// src/lib/food-presets/protein.ts

import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FoodPreset, DAYS } from "./types";

export const PROTEIN_PRESETS: FoodPreset[] = [
  { id: 'p1', emoji: '🍗', name: 'Pollastre sencer', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p2', emoji: '🍗', name: 'Pit de pollastre', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p3', emoji: '🍗', name: 'Cuixes de pollastre', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p11', emoji: '🍗', name: 'Aletes de pollastre', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p12', emoji: '🥩', name: 'Vedella fresca', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: DAYS.FRESH_MEAT },
  { id: 'p13', emoji: '🥩', name: 'Vedella picada', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p14', emoji: '🥩', name: 'Entrecot de vedella', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: DAYS.FRESH_MEAT },
  { id: 'p15', emoji: '🥩', name: 'Filet de vedella', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3, expirationDays: DAYS.FRESH_MEAT },
  { id: 'p16', emoji: '🐖', name: 'Llom de porc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: DAYS.FRESH_MEAT },
  { id: 'p17', emoji: '🐖', name: 'Costelles de porc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p18', emoji: '🐖', name: 'Carn picada de porc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p19', emoji: '🥓', name: 'Bacon', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 200, expirationDays: 30 },
  { id: 'p20', emoji: '🐑', name: 'Xai (cuixa)', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p21', emoji: '🐑', name: 'Costelles de xai', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p22', emoji: '🐟', name: 'Lluç', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3, expirationDays: DAYS.FRESH_FISH },
  { id: 'p23', emoji: '🐟', name: 'Bacallà fresc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3, expirationDays: DAYS.FRESH_FISH },
  { id: 'p25', emoji: '🐟', name: 'Orada', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3, expirationDays: DAYS.FRESH_FISH },
  { id: 'p26', emoji: '🐟', name: 'Llobarro', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3, expirationDays: DAYS.FRESH_FISH },
  { id: 'p29', emoji: '🐟', name: 'Salmó fresc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.2, expirationDays: DAYS.FRESH_FISH },
  { id: 'p30', emoji: '🐟', name: 'Salmó congelat', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p32', emoji: '🦐', name: 'Gambes', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 250, expirationDays: DAYS.FROZEN },
  { id: 'p38', emoji: '🥚', name: 'Ous', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 6, expirationDays: 21 },
  { id: 'p41', emoji: '🌱', name: 'Tofu', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  // 🍗 Aus extra
  { id: 'p42', emoji: '🦃', name: 'Gall dindi (pit)', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p43', emoji: '🦃', name: 'Gall dindi picat', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p44', emoji: '🍗', name: 'Conill', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },

  // 🥩 Vedella / boví extra
  { id: 'p45', emoji: '🥩', name: 'Hamburgueses de vedella', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FREEZER, step: 2, expirationDays: DAYS.FROZEN },
  { id: 'p46', emoji: '🥩', name: 'Estofat de vedella', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: DAYS.FRESH_MEAT },
  { id: 'p47', emoji: '🥩', name: 'Costella de vedella', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },

  // 🐖 Porc extra
  { id: 'p48', emoji: '🐖', name: 'Botifarra', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 2, expirationDays: 10 },
  { id: 'p49', emoji: '🐖', name: 'Salsitxes', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 4, expirationDays: 10 },
  { id: 'p50', emoji: '🐖', name: 'Pernil dolç', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 150, expirationDays: 15 },
  { id: 'p51', emoji: '🥓', name: 'Xoriço', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 150, expirationDays: DAYS.LONG_PANTRY },
  { id: 'p52', emoji: '🥓', name: 'Fuet', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 150, expirationDays: DAYS.LONG_PANTRY },

  // 🐟 Peix extra
  { id: 'p53', emoji: '🐟', name: 'Tonyina fresca', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3, expirationDays: DAYS.FRESH_FISH },
  { id: 'p54', emoji: '🐟', name: 'Tonyina en conserva', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 200, expirationDays: DAYS.LONG_PANTRY },
  { id: 'p55', emoji: '🐟', name: 'Sardines', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 300, expirationDays: DAYS.FRESH_FISH },
  { id: 'p56', emoji: '🐟', name: 'Seitons', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 300, expirationDays: DAYS.FRESH_FISH },
  { id: 'p57', emoji: '🐟', name: 'Verat', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3, expirationDays: DAYS.FRESH_FISH },

  // 🦐 Marisc extra
  { id: 'p58', emoji: '🦑', name: 'Calamars', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p59', emoji: '🦑', name: 'Pop', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 'p60', emoji: '🦐', name: 'Musclos', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 2 },
  { id: 'p61', emoji: '🦐', name: 'Escamarlans', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },

  // 🥚 Ous i derivats
  { id: 'p62', emoji: '🥚', name: 'Clares d’ou', category: '🥩 Proteïna', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 5 },

  // 🌱 Proteïna vegetal
  { id: 'p63', emoji: '🌱', name: 'Tempeh', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'p64', emoji: '🌱', name: 'Seitan', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'p65', emoji: '🌱', name: 'Proteïna vegetal texturitzada', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: DAYS.LONG_PANTRY },

  // 🏋️‍♂️ Fitness / complements
  { id: 'p66', emoji: '🥤', name: 'Batuts de proteïna', category: '🥩 Proteïna', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: 180 },
  { id: 'p67', emoji: '💊', name: 'Proteïna en pols', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: 365 },
];