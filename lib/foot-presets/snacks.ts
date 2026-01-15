// src/lib/food-presets/snacks.ts
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FoodPreset, DAYS } from "./types";

export const SNACK_PRESETS: FoodPreset[] = [
  { id: 's1', emoji: '🍪', name: 'Galetes', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's2', emoji: '🍫', name: 'Xocolata negra', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 365 },
  { id: 's3', emoji: '🍿', name: 'Crispetes', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 180 },
  { id: 's4', emoji: '🥜', name: 'Ametlles', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },

  // Dolços
  { id: 's5', emoji: '🍫', name: 'Xocolata amb llet', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 365 },
  { id: 's6', emoji: '🍫', name: 'Xocolata blanca', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 365 },
  { id: 's7', emoji: '🍬', name: 'Caramels', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 365 },
  { id: 's8', emoji: '🍭', name: 'Pirulís', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 365 },
  { id: 's9', emoji: '🧁', name: 'Magdalena', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 7 },
  { id: 's10', emoji: '🍩', name: 'Dònut', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 3 },

  // Salats
  { id: 's11', emoji: '🥨', name: 'Bastonets salats', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's12', emoji: '🥨', name: 'Pretzels', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's13', emoji: '🍟', name: 'Patates fregides', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's14', emoji: '🌮', name: 'Nachos', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },

  // Fruits secs i llavors
  { id: 's15', emoji: '🥜', name: 'Avellanes', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's16', emoji: '🥜', name: 'Nous', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's17', emoji: '🥜', name: 'Anacards', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's18', emoji: '🌰', name: 'Cacauets', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's19', emoji: '🌻', name: 'Pipes de gira-sol', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },

  // Altres
  { id: 's20', emoji: '🍪', name: 'Galetes salades', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's21', emoji: '🍪', name: 'Crackers', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's22', emoji: '🍫', name: 'Barretes de cereals', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 90 },
  { id: 's23', emoji: '🍯', name: 'Mel', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: DAYS.LONG_PANTRY },
  // 🍫 Dolços extra / rebosteria
  { id: 's24', emoji: '🍰', name: 'Pastís envasat', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 10 },
  { id: 's25', emoji: '🥧', name: 'Tarta dolça', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 's26', emoji: '🍪', name: 'Cookies amb xips de xocolata', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 14 },
  { id: 's27', emoji: '🍩', name: 'Croissant', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 3 },
  { id: 's28', emoji: '🥐', name: 'Croissant farcit', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 3 },

  // 🍿 Salats extra
  { id: 's29', emoji: '🧀', name: 'Snacks de formatge', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's30', emoji: '🥓', name: 'Snacks de bacon', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 60 },
  { id: 's31', emoji: '🍘', name: 'Crackers d’arròs', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 120 },
  { id: 's32', emoji: '🍘', name: 'Galetes d’arròs', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 120 },
  { id: 's33', emoji: '🥠', name: 'Snacks asiàtics', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 120 },

  // 🥜 Fruits secs premium / saludables
  { id: 's34', emoji: '🥜', name: 'Festucs', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's35', emoji: '🥜', name: 'Ametlles torrades', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's36', emoji: '🌰', name: 'Nous pecanes', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's37', emoji: '🥥', name: 'Xips de coco', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },

  // 🧃 Healthy / fitness
  { id: 's38', emoji: '🍎', name: 'Fruita deshidratada', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 180 },
  { id: 's39', emoji: '🍫', name: 'Barreta proteica', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 180 },
  { id: 's40', emoji: '🫘', name: 'Cigrons torrats', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },
  { id: 's41', emoji: '🌽', name: 'Blat de moro torrat', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100, expirationDays: 90 },

  // ❄️ Nevera / congelador
  { id: 's42', emoji: '🍦', name: 'Gelat', category: '🍪 Snack', defaultUnit: 'l', defaultLoc: StorageLocation.FREEZER, step: 0.5, expirationDays: DAYS.FROZEN },
  { id: 's43', emoji: '🧊', name: 'Polos de gel', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.FREEZER, step: 1, expirationDays: DAYS.FROZEN },
  { id: 's44', emoji: '🍫', name: 'Brownie', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },

  // 🌍 Internacionals / street food
  { id: 's45', emoji: '🥟', name: 'Empanadilles', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.FREEZER, step: 6, expirationDays: DAYS.FROZEN },
  { id: 's46', emoji: '🍙', name: 'Onigiri', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 2 },
  { id: 's47', emoji: '🥙', name: 'Falàfel', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 200, expirationDays: 5 },
];