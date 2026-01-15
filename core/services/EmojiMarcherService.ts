import { FOOD_PRESETS, FoodPreset } from '@/lib/foot-presets';

export class EmojiMatcherService {
  
  /**
   * Busca el millor preset (emoji, categoria) per a un nom de producte.
   * Fa servir un sistema de puntuació simple per trobar la millor coincidència.
   */
  static match(productName: string): FoodPreset | null {
    const lowerName = productName.toLowerCase();
    
    // 1. Cerca exacta (poc probable amb noms llargs de supermercat)
    const exactMatch = FOOD_PRESETS.find(p => p.name.toLowerCase() === lowerName);
    if (exactMatch) return exactMatch;

    // 2. Cerca per paraules clau (la més potent)
    // Busquem quin preset té el nom que apareix dins del nom del producte.
    // Ex: "Llet" està dins de "BONPREU Llet Semidesnatada"
    
    // Ordenem els presets per longitud de nom (de més llarg a més curt)
    // Això evita que "Pa" faci match amb "Pasta" abans que "Pasta" ho faci.
    const sortedPresets = [...FOOD_PRESETS].sort((a, b) => b.name.length - a.name.length);

    for (const preset of sortedPresets) {
      const presetName = preset.name.toLowerCase();
      
      // Cas especial: Plurals (si el preset és "Poma", que trobi "Pomes")
      // Una lògica molt bàsica de pluralització (afegir 's' o 'es')
      const singular = presetName;
      const pluralS = presetName + 's';
      const pluralES = presetName + 'es';

      if (
        lowerName.includes(singular) || 
        lowerName.includes(pluralS) || 
        lowerName.includes(pluralES)
      ) {
        return preset;
      }
    }

    return null;
  }

  /**
   * Retorna l'emoji si en troba un, o el default 📦
   */
  static getEmoji(productName: string, defaultEmoji: string = '📦'): string {
    const match = this.match(productName);
    return match ? match.emoji : defaultEmoji;
  }
}