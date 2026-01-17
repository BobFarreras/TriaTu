import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FoodPreset, DAYS } from "./types";

export const VEGETABLE_PRESETS: FoodPreset[] = [

  // 🥕 Arrels i tubercles
  { id: 'v1', emoji: '🥕', name: 'Pastanaga', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.1, expirationDays: DAYS.ROOTS },
  { id: 'v2', emoji: '🥔', name: 'Patata', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.ROOTS },
  { id: 'v31', emoji: '🍠', name: 'Moniato', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.ROOTS },
  { id: 'v33', emoji: '🥔', name: 'Yuca', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5, expirationDays: DAYS.ROOTS },
  { id: 'v24', emoji: '🫚', name: 'Nap', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'v25', emoji: '🥕', name: 'Remolatxa', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 14 },

  // 🧅 Bulbs i aromàtiques
  { id: 'v3', emoji: '🧅', name: 'Ceba blanca', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.ROOTS },
  { id: 'v4', emoji: '🧅', name: 'Ceba morada', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.ROOTS },
  { id: 'v35', emoji: '🧅', name: 'Ceba tendra', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'v5', emoji: '🧄', name: 'All', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.ROOTS },
  { id: 'v36', emoji: '🧄', name: 'All tendre', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'v37', emoji: '🧅', name: 'Escalunya', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.ROOTS },
  { id: 'v23', emoji: '🫚', name: 'Gingebre', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 50, expirationDays: 30 },
  { id: 'v34', emoji: '🫚', name: 'Cúrcuma fresca', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 50, expirationDays: 30 },

  // 🍅 Fruita-verdura / mediterrànies
  { id: 'v6', emoji: '🍅', name: 'Tomàquet madur', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 7 },
  { id: 'v7', emoji: '🍅', name: 'Tomàquet cherry', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250, expirationDays: 10 },
  { id: 'v43', emoji: '🍅', name: 'Tomàquet pera', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 7 },
  { id: 'v44', emoji: '🍅', name: 'Tomàquet cor de bou', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 6 },
  { id: 'v15', emoji: '🍆', name: 'Albergínia', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'v19', emoji: '🥒', name: 'Carbassó', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'v9', emoji: '🥒', name: 'Cogombre', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'v45', emoji: '🌶️', name: 'Bitxo', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 50, expirationDays: 14 },
  { id: 'v16', emoji: '🌶️', name: 'Pebrot verd', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'v17', emoji: '🌶️', name: 'Pebrot vermell', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'v18', emoji: '🌶️', name: 'Pebrot groc', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },

  // 🥬 Fulles
  { id: 'v10', emoji: '🥬', name: 'Enciam iceberg', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'v11', emoji: '🥬', name: 'Enciam romà', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: DAYS.LEAFY },
  { id: 'v12', emoji: '🥬', name: 'Enciam fulla de roure', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: DAYS.LEAFY },
  { id: 'v13', emoji: '🥬', name: 'Espinacs frescos', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 5 },
  { id: 'v14', emoji: '🥬', name: 'Rúcula', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 50, expirationDays: 5 },
  { id: 'v38', emoji: '🥬', name: 'Bledes', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250, expirationDays: DAYS.LEAFY },
  { id: 'v39', emoji: '🥬', name: 'Canonges', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100, expirationDays: 5 },
  { id: 'v40', emoji: '🥬', name: 'Endívia', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },

  // 🥦 Crucíferes
  { id: 'v8', emoji: '🥦', name: 'Bròquil', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'v20', emoji: '🥦', name: 'Coliflor', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'v21', emoji: '🥬', name: 'Col verda', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'v22', emoji: '🥬', name: 'Col llombarda', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },
  { id: 'v41', emoji: '🥦', name: 'Cols de Brussel·les', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 500, expirationDays: 10 },
  { id: 'v42', emoji: '🥦', name: 'Romanesco', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },

  // 🍄 Fongs
  { id: 'v29', emoji: '🍄', name: 'Xampinyons', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250, expirationDays: 5 },
  { id: 'v30', emoji: '🍄', name: 'Bolets variats', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250, expirationDays: 5 },

  // 🫘 Llegums i vegetals proteics
  { id: 'v28', emoji: '🫘', name: 'Mongetes verdes', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 7 },
  { id: 'v26', emoji: '🌽', name: 'Blat de moro', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
  { id: 'v49', emoji: '🫘', name: 'Faves fresques', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5, expirationDays: 7 },
  { id: 'v27', emoji: '🫛', name: 'Pèsols', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 250, expirationDays: DAYS.FROZEN },
  { id: 'v50', emoji: '🫛', name: 'Edamame', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 400, expirationDays: DAYS.FROZEN },

  // 🌍 Asiàtics / internacionals
  { id: 'v46', emoji: '🥬', name: 'Pak choi', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
  { id: 'v47', emoji: '🥬', name: 'Col xinesa', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 10 },
  { id: 'v48', emoji: '🎋', name: 'Brot de bambú', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 400, expirationDays: DAYS.LONG_PANTRY },

];
