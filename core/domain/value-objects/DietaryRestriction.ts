export enum DietaryRestriction {
  GLUTEN_FREE = 'GLUTEN_FREE',
  NUT_ALLERGY = 'NUT_ALLERGY',
  LACTOSE_INTOLERANT = 'LACTOSE_INTOLERANT',
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
  SHELLFISH_ALLERGY = 'SHELLFISH_ALLERGY'
}

// Paraules prohibides per a cada restricció (Lògica de negoci)
export const RESTRICTION_KEYWORDS: Record<DietaryRestriction, string[]> = {
  [DietaryRestriction.GLUTEN_FREE]: ['blat', 'farina', 'pasta', 'pa', 'ordi', 'galeta'],
  [DietaryRestriction.NUT_ALLERGY]: ['cacauet', 'nou', 'ametlla', 'avellana', 'satay', 'praliné'],
  [DietaryRestriction.LACTOSE_INTOLERANT]: ['llet', 'nata', 'formatge', 'mantega', 'iogurt', 'crema'],
  [DietaryRestriction.VEGAN]: ['carn', 'peix', 'ou', 'llet', 'mel', 'formatge', 'pollastre'],
  [DietaryRestriction.VEGETARIAN]: ['carn', 'peix', 'pollastre', 'vedella', 'porc', 'pernil'],
  [DietaryRestriction.SHELLFISH_ALLERGY]: ['gamba', 'llagostí', 'cranc', 'musclo', 'cloïssa', 'marisc']
};