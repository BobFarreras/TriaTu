import { FOOD_PRESETS, FoodPreset } from '@/lib/food-presets';

export class EmojiMatcherService {
  
  // Normalització agressiva: minúscules, sense accents, sense 'd' 'de' 'el' (articles)
  private static normalize(text: string): string {
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Fora accents
      .replace(/\b(de|del|d'|el|la|ls|les)\b/g, "") // Fora articles i preposicions
      .replace(/[^a-z0-9\s]/g, "") // Fora caràcters especials (com ')
      .trim();
  }

  // Helper per obtenir l'arrel d'una paraula (treure plurals bàsics)
  private static getRoot(word: string): string {
    if (word.endsWith('es')) return word.slice(0, -2); // Patates -> Patat
    if (word.endsWith('s')) return word.slice(0, -1);  // Ous -> Ou
    return word;
  }

  static match(productName: string): FoodPreset | null {
    if (!productName) return null;
    
    // 1. MATCH EXACTE (Prioritat màxima)
    // Busquem sense normalitzar tant primer, per si de cas
    const exactMatch = FOOD_PRESETS.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (exactMatch) return exactMatch;

    const normInput = this.normalize(productName);
    
    // Ordenem per longitud per prioritzar "Ceba tendra" (llarg) abans que "Ceba" (curt)
    const sortedPresets = [...FOOD_PRESETS].sort((a, b) => b.name.length - a.name.length);

    for (const preset of sortedPresets) {
      const normPreset = this.normalize(preset.name);
      
      // CAS A: EL PRESET ESTÀ DINS DE L'INPUT (Ex: "Pernil" dins "Pernil cuit")
      // Utilitzem límits de paraula (\b) per evitar "Te" dins "Patates"
      try {
          const regex = new RegExp(`\\b${normPreset}\\b`, 'i');
          if (regex.test(normInput)) {
            // console.log(`🧩 [Matcher] "${productName}" conté el preset "${preset.name}"`);
            return preset;
          }
      } catch {
          // Ignorem errors de regex per caràcters estranys
      }

      // CAS B: GESTIÓ DE PLURALS (El més important per tu ara)
      // Si input és "Patates" i preset és "Patata"
      const rootInput = this.getRoot(normInput);
      const rootPreset = this.getRoot(normPreset);

      // Si les arrels coincideixen i tenen una longitud decent (>2 lletres)
      if (rootInput.includes(rootPreset) && rootPreset.length > 2) {
         // Verificació extra: Assegurar que és una paraula completa
         // Ex: "Patat" (arrel) està al principi de "Patates" (input)
         if (normInput.startsWith(rootPreset) || normInput.includes(" " + rootPreset)) {
             console.log(`🧩 [Matcher] PLURAL: "${productName}" sembla plural de "${preset.name}"`);
             return preset;
         }
      }
      
      // CAS C: L'INPUT ESTÀ DINS DEL PRESET (Ex: "Tomaquet" dins "Tomaquet fregit")
      if (normPreset.includes(normInput) && normInput.length > 3) {
          return preset;
      }
    }

    return null;
  }

  static getEmoji(productName: string, defaultEmoji: string = '🥘'): string {
    const match = this.match(productName);
    return match ? match.emoji : defaultEmoji;
  }

  static getId(productName: string): string | undefined {
    const match = this.match(productName);
    return match ? match.id : undefined;
  }
}