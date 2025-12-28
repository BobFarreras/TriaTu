import { FOOD_METADATA } from '@/core/constants/food-tags';

export class FoodKnowledgeService {
  
  /**
   * Retorna totes les etiquetes associades a un terme (ex: 'pizza' -> ['gluten', 'italian'])
   */
  public getTagsFor(foodItem: string): string[] {
    const normalized = foodItem.toLowerCase().trim();
    // Retorna els tags directes o un array buit
    return FOOD_METADATA[normalized] || [];
  }

  /**
   * Comprova si un aliment conté un ingredient conflictiu (ex: 'pizza' conté 'gluten'?)
   */
  public hasConflict(foodItem: string, exclusion: string): boolean {
    const tags = this.getTagsFor(foodItem);
    const normalizedExclusion = exclusion.toLowerCase();
    
    // Conflicte directe: El tag està a la llista (ex: 'gluten' està als tags de 'pizza')
    if (tags.includes(normalizedExclusion)) return true;

    // Conflicte per nom: L'aliment és l'exclusió mateixa (ex: exclusion='pizza', food='pizza')
    if (foodItem.toLowerCase().includes(normalizedExclusion)) return true;

    return false;
  }

  /**
   * Comprova si un aliment coincideix amb una preferència (ex: 'pizza' és 'italian'?)
   */
  public matchesPreference(foodItem: string, preference: string): boolean {
    const tags = this.getTagsFor(foodItem);
    const normalizedPref = preference.toLowerCase();

    // 1. Coincidència directa (ex: m'agrada 'pizza', opció 'pizza')
    if (foodItem.toLowerCase() === normalizedPref) return true;

    // 2. Coincidència per categoria (ex: m'agrada 'italian', opció 'pizza' té tag 'italian')
    if (tags.includes(normalizedPref)) return true;

    return false;
  }
}