// Definim què conté cada plat (ingredients, dietes, estils i cultures)
export const FOOD_METADATA: Record<string, string[]> = {
  // ======================
  // 🍕 PLATS CLÀSSICS
  // ======================
  pizza: ['gluten', 'dairy', 'italian', 'comfort_food', 'oven'],
  burger: ['gluten', 'meat', 'american', 'fast_food'],
  sushi: ['fish', 'rice', 'japanese', 'asian', 'seafood'],
  pasta: ['gluten', 'italian', 'comfort_food'],
  lasagna: ['gluten', 'dairy', 'italian', 'comfort_food'],
  risotto: ['rice', 'italian', 'comfort_food'],
  salad: ['healthy', 'vegan', 'vegetarian', 'fresh'],
  steak: ['meat', 'bbq', 'grill', 'protein'],
  tacos: ['mexican', 'corn', 'meat', 'spicy'],
  burrito: ['mexican', 'gluten', 'meat', 'rice'],
  nachos: ['mexican', 'corn', 'dairy', 'snack'],
  ramen: ['gluten', 'egg', 'japanese', 'asian', 'soup'],
  paella: ['rice', 'seafood', 'spanish'],
  kebab: ['meat', 'gluten', 'fast_food', 'turkish'],
  falafel: ['vegan', 'vegetarian', 'middle_eastern', 'fried'],
  hummus: ['vegan', 'vegetarian', 'middle_eastern'],
  curry: ['spicy', 'indian', 'asian'],
  pad_thai: ['thai', 'asian', 'rice_noodles', 'egg'],
  pho: ['vietnamese', 'asian', 'soup'],
  ceviche: ['fish', 'seafood', 'peruvian', 'fresh'],
  poke: ['fish', 'rice', 'hawaiian', 'healthy'],
  hotdog: ['gluten', 'meat', 'fast_food'],
  fried_chicken: ['meat', 'fried', 'comfort_food'],
  grilled_fish: ['fish', 'healthy', 'protein'],
  omelette: ['egg', 'vegetarian', 'breakfast'],
  sandwich: ['gluten', 'fast_food'],
  soup: ['soup', 'warm'],
  bbq_ribs: ['meat', 'bbq'],
  tapas: ['spanish', 'snack', 'shared'],

  // ======================
  // 🥗 DIETES / ESTILS
  // ======================
  vegan_dish: ['vegan', 'vegetarian', 'plant_based'],
  vegetarian_dish: ['vegetarian'],
  keto_dish: ['keto', 'low_carb', 'protein'],
  paleo_dish: ['paleo', 'protein', 'gluten_free'],
  gluten_free_dish: ['gluten_free'],
  lactose_free_dish: ['lactose_free'],
  low_carb_dish: ['low_carb'],
  high_protein_dish: ['protein'],
  healthy_dish: ['healthy', 'fresh'],
  comfort_dish: ['comfort_food'],
  street_food: ['fast_food'],
  gourmet_dish: ['gourmet'],

  // ======================
  // 🌍 CUINES / PAÏSOS
  // ======================
  italian: ['pizza', 'pasta', 'risotto', 'lasagna'],
  japanese: ['sushi', 'ramen', 'tempura'],
  mexican: ['tacos', 'burrito', 'nachos'],
  american: ['burger', 'steak', 'hotdog', 'bbq_ribs'],
  spanish: ['paella', 'tapas'],
  french: ['quiche', 'croissant', 'gourmet'],
  greek: ['gyro', 'salad', 'mediterranean'],
  turkish: ['kebab', 'baklava'],
  lebanese: ['falafel', 'hummus'],
  indian: ['curry', 'naan'],
  thai: ['pad_thai', 'curry'],
  vietnamese: ['pho'],
  peruvian: ['ceviche'],
  brazilian: ['churrasco'],
  argentinian: ['steak', 'bbq'],
  german: ['sausage', 'sauerkraut'],
  mediterranean: ['olive_oil', 'fish', 'vegetables'],
  hawaiian: ['poke'],
  asian: ['sushi', 'ramen', 'pho', 'curry'],

  // ======================
  // 🚫 AL·LÈRGENS
  // ======================
  gluten: ['pizza', 'pasta', 'burger', 'sandwich', 'ramen'],
  dairy: ['pizza', 'lasagna', 'nachos'],
  egg: ['ramen', 'omelette'],
  nuts: ['asian', 'thai'],
  seafood: ['sushi', 'paella', 'ceviche'],
  fish: ['sushi', 'grilled_fish', 'poke'],

  // ======================
  // 🌶️ CARACTERÍSTIQUES
  // ======================
  spicy: ['tacos', 'curry', 'thai'],
  fried: ['fried_chicken', 'falafel'],
  grilled: ['steak', 'grilled_fish'],
  soup_based: ['ramen', 'pho', 'soup'],
  fast_food: ['burger', 'kebab', 'hotdog'],
  comfort_food: ['pizza', 'pasta', 'fried_chicken'],
  healthy: ['salad', 'grilled_fish', 'poke'],
};
