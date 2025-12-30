import { StorageLocation } from "@/core/domain/entities/StorageLocation";

// ✅ Els teus tipus personalitzats amb emojis
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
  step: number; // Increment per als botons +/-
};


export const FOOD_PRESETS: FoodPreset[] = [

  // 🍎 FRUITA — pomes i variants
  { id: 'f1', emoji: '🍎', name: 'Poma vermella', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f2', emoji: '🍏', name: 'Poma verda', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f3', emoji: '🍎', name: 'Poma groga', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Fruita comuna
  { id: 'f4', emoji: '🍌', name: 'Plàtan', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'f5', emoji: '🍌', name: 'Plàtan mascle', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'f6', emoji: '🍐', name: 'Pera conference', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f7', emoji: '🍐', name: 'Pera blanquilla', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Cítrics
  { id: 'f8', emoji: '🍊', name: 'Taronja', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'f9', emoji: '🍊', name: 'Mandarina', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'f10', emoji: '🍋', name: 'Llimona', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'f11', emoji: '🍋', name: 'Llima', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'f12', emoji: '🍊', name: 'Aranja', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },

  // Fruita petita
  { id: 'f13', emoji: '🍓', name: 'Maduixa', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'f14', emoji: '🫐', name: 'Nabius', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'f15', emoji: '🍒', name: 'Cireres', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.2 },
  { id: 'f16', emoji: '🍇', name: 'Raïm blanc', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.1 },
  { id: 'f17', emoji: '🍇', name: 'Raïm negre', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.1 },

  // Fruita d’os
  { id: 'f18', emoji: '🍑', name: 'Préssec', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f19', emoji: '🍑', name: 'Nectarina', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f20', emoji: '🍑', name: 'Paraguaià', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f21', emoji: '🍒', name: 'Pruna', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f22', emoji: '🍒', name: 'Albercoc', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Fruita tropical
  { id: 'f23', emoji: '🥝', name: 'Kiwi verd', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f24', emoji: '🥝', name: 'Kiwi groc', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f25', emoji: '🍍', name: 'Pinya', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f26', emoji: '🥭', name: 'Mango', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f27', emoji: '🍈', name: 'Meló', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'f28', emoji: '🍉', name: 'Síndria', category: '🍎 Fruita', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'f29', emoji: '🥥', name: 'Coco', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },

  // Altres
  { id: 'f30', emoji: '🍎', name: 'Codony', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f31', emoji: '🍎', name: 'Figa', category: '🍎 Fruita', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'f32', emoji: '🍌', name: 'Dàtil fresc', category: '🍎 Fruita', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },


  // 🥦 VERDURA
  { id: 'v1', emoji: '🥕', name: 'Pastanaga', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.1 },
  { id: 'v2', emoji: '🥔', name: 'Patata', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'v3', emoji: '🧅', name: 'Ceba blanca', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'v4', emoji: '🧅', name: 'Ceba morada', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'v5', emoji: '🧄', name: 'All', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'v6', emoji: '🍅', name: 'Tomàquet madur', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'v7', emoji: '🍅', name: 'Tomàquet cherry', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250 },
  { id: 'v8', emoji: '🥦', name: 'Bròquil', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v9', emoji: '🥒', name: 'Cogombre', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Fulles i amanida
  { id: 'v10', emoji: '🥬', name: 'Enciam iceberg', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v11', emoji: '🥬', name: 'Enciam romà', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v12', emoji: '🥬', name: 'Enciam fulla de roure', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v13', emoji: '🥬', name: 'Espinacs frescos', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'v14', emoji: '🥬', name: 'Rúcula', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 50 },

  // Verdures de fruit
  { id: 'v15', emoji: '🍆', name: 'Albergínia', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v16', emoji: '🌶️', name: 'Pebrot verd', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v17', emoji: '🌶️', name: 'Pebrot vermell', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v18', emoji: '🌶️', name: 'Pebrot groc', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v19', emoji: '🥒', name: 'Carbassó', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Crucíferes
  { id: 'v20', emoji: '🥦', name: 'Coliflor', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v21', emoji: '🥬', name: 'Col verda', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v22', emoji: '🥬', name: 'Col llombarda', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Arrels i bulbs
  { id: 'v23', emoji: '🫚', name: 'Gingebre', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 50 },
  { id: 'v24', emoji: '🫚', name: 'Nap', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v25', emoji: '🥕', name: 'Remolatxa', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },

  // Altres habituals
  { id: 'v26', emoji: '🌽', name: 'Blat de moro', category: '🥦 Verdura', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'v27', emoji: '🫛', name: 'Pèsols', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 250 },
  { id: 'v28', emoji: '🫘', name: 'Mongetes verdes', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'v29', emoji: '🍄', name: 'Xampinyons', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250 },
  { id: 'v30', emoji: '🍄', name: 'Bolets variats', category: '🥦 Verdura', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250 },


  // 🥩 PROTEÏNA — pollastre
  { id: 'p1', emoji: '🍗', name: 'Pollastre sencer', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p2', emoji: '🍗', name: 'Pit de pollastre', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p3', emoji: '🍗', name: 'Cuixes de pollastre', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p11', emoji: '🍗', name: 'Aletes de pollastre', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },

  // 🥩 Vedella
  { id: 'p12', emoji: '🥩', name: 'Vedella fresca', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'p13', emoji: '🥩', name: 'Vedella picada', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p14', emoji: '🥩', name: 'Entrecot de vedella', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'p15', emoji: '🥩', name: 'Filet de vedella', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3 },

  // 🐖 Porc
  { id: 'p16', emoji: '🐖', name: 'Llom de porc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'p17', emoji: '🐖', name: 'Costelles de porc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p18', emoji: '🐖', name: 'Carn picada de porc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p19', emoji: '🥓', name: 'Bacon', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 200 },

  // 🐑 Xai
  { id: 'p20', emoji: '🐑', name: 'Xai (cuixa)', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p21', emoji: '🐑', name: 'Costelles de xai', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },

  // 🐟 PEIX BLANC
  { id: 'p22', emoji: '🐟', name: 'Lluç', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3 },
  { id: 'p23', emoji: '🐟', name: 'Bacallà fresc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3 },
  { id: 'p24', emoji: '🐟', name: 'Bacallà dessalat', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3 },
  { id: 'p25', emoji: '🐟', name: 'Orada', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3 },
  { id: 'p26', emoji: '🐟', name: 'Llobarro', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3 },

  // 🐟 PEIX BLAU
  { id: 'p27', emoji: '🐟', name: 'Sardines', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'p28', emoji: '🐟', name: 'Verat', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.5 },
  { id: 'p29', emoji: '🐟', name: 'Salmó fresc', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.2 },
  { id: 'p30', emoji: '🐟', name: 'Salmó congelat', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p31', emoji: '🐟', name: 'Tonyina fresca', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 0.3 },

  // 🦐 MARISC
  { id: 'p32', emoji: '🦐', name: 'Gambes', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 250 },
  { id: 'p33', emoji: '🦑', name: 'Calamar', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 0.5 },
  { id: 'p34', emoji: '🦪', name: 'Musclos', category: '🥩 Proteïna', defaultUnit: 'kg', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'p35', emoji: '🦞', name: 'Llagostí', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 250 },

  // 🥫 CONSERVES I ALTRES
  { id: 'p36', emoji: '🥫', name: 'Tonyina en conserva', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'p37', emoji: '🥫', name: 'Sardines en conserva', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'p38', emoji: '🥚', name: 'Ous', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 6 },

  // 🫘 VEGETALS
  { id: 'p39', emoji: '🫘', name: 'Llenties cuites', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 400 },
  { id: 'p40', emoji: '🫘', name: 'Cigrons cuits', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 400 },
  { id: 'p41', emoji: '🌱', name: 'Tofu', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // 🥛 LÀCTICS
  { id: 'l1', emoji: '🥛', name: 'Llet sencera', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l2', emoji: '🥛', name: 'Llet semi', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l3', emoji: '🥛', name: 'Llet desnatada', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l4', emoji: '🥛', name: 'Llet sense lactosa', category: '🥛 Lactic', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Formatges
  { id: 'l5', emoji: '🧀', name: 'Formatge curat', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'l6', emoji: '🧀', name: 'Formatge semicurat', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'l7', emoji: '🧀', name: 'Formatge tendre', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'l8', emoji: '🧀', name: 'Formatge ratllat', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'l9', emoji: '🧀', name: 'Mozzarella', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l10', emoji: '🧀', name: 'Formatge parmesà', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'l11', emoji: '🧀', name: 'Formatge fresc', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l12', emoji: '🧀', name: 'Formatge blau', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },

  // Iogurts i postres
  { id: 'l13', emoji: '🥣', name: 'Iogurt natural', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l14', emoji: '🥣', name: 'Iogurt grec', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l15', emoji: '🥣', name: 'Iogurt de maduixa', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l16', emoji: '🍮', name: 'Flam', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'l17', emoji: '🍮', name: 'Natilles', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Altres làctics
  { id: 'l18', emoji: '🧈', name: 'Mantega', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 100 },
  { id: 'l19', emoji: '🧴', name: 'Nata per cuinar', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 200 },
  { id: 'l20', emoji: '🍦', name: 'Gelat', category: '🥛 Lactic', defaultUnit: 'ut', defaultLoc: StorageLocation.FREEZER, step: 1 },


  // 🥖 CEREALS
  { id: 'c1', emoji: '🍞', name: 'Pa blanc', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c2', emoji: '🍞', name: 'Pa integral', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c3', emoji: '🍝', name: 'Pasta espagueti', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'c4', emoji: '🍝', name: 'Pasta macarrons', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'c5', emoji: '🍚', name: 'Arròs blanc', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1 },

  // Pa i brioixeria
  { id: 'c6', emoji: '🥖', name: 'Barra de pa', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c7', emoji: '🥐', name: 'Croissant', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c8', emoji: '🥯', name: 'Bagel', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c9', emoji: '🍞', name: 'Pa de motlle', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },

  // Pasta i derivats
  { id: 'c10', emoji: '🍝', name: 'Pasta fusilli', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'c11', emoji: '🍝', name: 'Pasta penne', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'c12', emoji: '🍜', name: 'Fideus', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },

  // Arròs i grans
  { id: 'c13', emoji: '🍚', name: 'Arròs integral', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c14', emoji: '🍚', name: 'Arròs basmati', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c15', emoji: '🍚', name: 'Arròs jazmín', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c16', emoji: '🌾', name: 'Cuscús', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'c17', emoji: '🌾', name: 'Quinoa', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },

  // Esmorzar
  { id: 'c18', emoji: '🥣', name: 'Cereals d’esmorzar', category: '🥖 Cereals', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250 },
  { id: 'c19', emoji: '🥣', name: 'Flocs de civada', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'c20', emoji: '🥣', name: 'Muesli', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 0.5 },

  // Farines
  { id: 'c21', emoji: '🌾', name: 'Farina de blat', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c22', emoji: '🌾', name: 'Farina integral', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c23', emoji: '🌾', name: 'Farina de civada', category: '🥖 Cereals', defaultUnit: 'kg', defaultLoc: StorageLocation.PANTRY, step: 1 },

  // 🥤 BEGUDA
  { id: 'b1', emoji: '💧', name: 'Aigua', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'b2', emoji: '☕', name: 'Cafè mòlt', category: '🥤 Beguda', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250 },
  { id: 'b3', emoji: '🍵', name: 'Te', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 20 },
  { id: 'b4', emoji: '🥤', name: 'Refresc cola', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Begudes fredes
  { id: 'b5', emoji: '🥤', name: 'Refresc taronja', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'b6', emoji: '🥤', name: 'Refresc llimona', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'b7', emoji: '🧃', name: 'Suc de taronja', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'b8', emoji: '🧃', name: 'Suc de poma', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // Begudes calentes
  { id: 'b9', emoji: '☕', name: 'Cafè en gra', category: '🥤 Beguda', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250 },
  { id: 'b10', emoji: '☕', name: 'Cafè soluble', category: '🥤 Beguda', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 200 },
  { id: 'b11', emoji: '🍵', name: 'Infusions', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 20 },

  // Altres
  { id: 'b12', emoji: '🥛', name: 'Beguda vegetal de civada', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'b13', emoji: '🥛', name: 'Beguda vegetal d’ametlla', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'b14', emoji: '🍺', name: 'Cervesa', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'b15', emoji: '🍷', name: 'Vi', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.75 },

  { id: 'b16', emoji: '🥂', name: 'Vi blanc', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 0.75 },
  { id: 'b17', emoji: '🍾', name: 'Cava', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 0.75 },
  { id: 'b18', emoji: '🥃', name: 'Vermut', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'b19', emoji: '🥤', name: 'Tònica', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },

  // 🍪 SNACK
  { id: 's1', emoji: '🍪', name: 'Galetes', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's2', emoji: '🍫', name: 'Xocolata negra', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's3', emoji: '🍿', name: 'Crispetes', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 's4', emoji: '🥜', name: 'Ametlles', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },

  // Dolços
  { id: 's5', emoji: '🍫', name: 'Xocolata amb llet', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's6', emoji: '🍫', name: 'Xocolata blanca', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's7', emoji: '🍬', name: 'Caramels', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's8', emoji: '🍭', name: 'Pirulís', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 's9', emoji: '🧁', name: 'Magdalena', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 's10', emoji: '🍩', name: 'Dònut', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },

  // Salats
  { id: 's11', emoji: '🥨', name: 'Bastonets salats', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's12', emoji: '🥨', name: 'Pretzels', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's13', emoji: '🍟', name: 'Patates fregides', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's14', emoji: '🌮', name: 'Nachos', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },

  // Fruits secs i llavors
  { id: 's15', emoji: '🥜', name: 'Avellanes', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's16', emoji: '🥜', name: 'Nous', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's17', emoji: '🥜', name: 'Anacards', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's18', emoji: '🌰', name: 'Cacauets', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's19', emoji: '🌻', name: 'Pipes de gira-sol', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },

  // Altres
  { id: 's20', emoji: '🍪', name: 'Galetes salades', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's21', emoji: '🍪', name: 'Crackers', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 100 },
  { id: 's22', emoji: '🍫', name: 'Barretes de cereals', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 's23', emoji: '🍯', name: 'Mel', category: '🍪 Snack', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250 },

  // 🧂 CONDIMENTS I OLIS (NOVA CATEGORIA EXPANDIDA)
  { id: 'co1', emoji: '🫒', name: 'Oli d\'oliva verge', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'co2', emoji: '🌻', name: 'Oli de gira-sol', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'co3', emoji: '🧂', name: 'Sal', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 500 },
  { id: 'co4', emoji: '🧂', name: 'Pebre negre', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50 },
  { id: 'co5', emoji: '🍯', name: 'Vinagre de vi', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.5 },
  { id: 'co6', emoji: '🍯', name: 'Vinagre de mòdena', category: '🧂 Condiments', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.25 },
  { id: 'co7', emoji: '🧈', name: 'Mantega', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250 },
  { id: 'co8', emoji: '🧈', name: 'Margarina', category: '🥛 Lactic', defaultUnit: 'g', defaultLoc: StorageLocation.FRIDGE, step: 250 },
  { id: 'co9', emoji: '🍅', name: 'Quètxup', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'co10', emoji: '🥚', name: 'Maionesa', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'co11', emoji: '🍯', name: 'Mostassa', category: '🧂 Condiments', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1 },
  { id: 'co12', emoji: '🫙', name: 'Melmelada', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'co13', emoji: '🍲', name: 'Brou de pollastre', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'co14', emoji: '🍲', name: 'Brou de peix', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'co15', emoji: '🥘', name: 'Tomàquet fregit', category: '🧂 Condiments', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 400 },



  // 🥖 CONGELATS RÀPIDS
  { id: 'z1', emoji: '🍕', name: 'Pizza congelada', category: '🍪 Snack', defaultUnit: 'ut', defaultLoc: StorageLocation.FREEZER, step: 1 },
  { id: 'z2', emoji: '🍟', name: 'Patates pre-fregides', category: '🥦 Verdura', defaultUnit: 'kg', defaultLoc: StorageLocation.FREEZER, step: 1 },
  { id: 'z3', emoji: '🥘', name: 'Lassanya preparada', category: '🥩 Proteïna', defaultUnit: 'ut', defaultLoc: StorageLocation.FREEZER, step: 1 },
  { id: 'z4', emoji: '🍘', name: 'Croquetes', category: '🥩 Proteïna', defaultUnit: 'g', defaultLoc: StorageLocation.FREEZER, step: 500 },

  // 🍞 MÉS CEREALS I FORN
  { id: 'c24', emoji: '🥐', name: 'Ensaïmada', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c25', emoji: '🍰', name: 'Pa de pessic', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
  { id: 'c26', emoji: '🌮', name: 'Tortilles de blat', category: '🥖 Cereals', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 1 },
];

export const PRESET_CATEGORIES = Array.from(
  new Set(FOOD_PRESETS.map(p => p.category))
);
