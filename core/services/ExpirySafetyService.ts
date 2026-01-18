import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FOOD_PRESETS } from "@/lib/food-presets"; 

export class ExpirySafetyService {
  
  static applySafetyRules(name: string, location: string, aiDate?: string, tags: string[] = []): string {
    const today = new Date();
    
    // Normalitzem tags
    const normalizedTags = tags ? tags.map(t => t.toUpperCase()) : [];

    console.log(`🔍 [ExpiryDebug] Analitzant: "${name}"`);
    console.log(`   🏷️ Tags: ${JSON.stringify(normalizedTags)}`);

    // --- REGLA 1: CONGELATS (SAGRADA) ---
    // Tant se val si és KM0 o no. Si està congelat, dura 6 mesos.
    if (normalizedTags.includes('CONGELAT') || location === StorageLocation.FREEZER) {
       if (aiDate && this.daysDiff(new Date(aiDate)) > 90) return aiDate;
       return this.addDays(today, 180); 
    }

    // --- REGLA 2: KM0 DIRECTE (LA TEVA PETICIÓ) ---
    // Si és KM0 -> 10 dies. Punt. 
    // Això arregla el cogombre, l'enciam i qualsevol cosa fresca de proximitat.
    if (normalizedTags.includes('KM0')) {
        console.log(`   ✅ REGLA APLICADA: KM0 Directe (10 dies)`);
        // Nota: Si la IA havia predit una data (aiDate), la ignorem o la respectem?
        // Si volem ser estrictes amb els 10 dies:
        return this.addDays(today, 10);
    }

    // --- REGLA 3: CONSERVES I SECS ---
    if (normalizedTags.includes('CONSERVA') || normalizedTags.includes('SEC') || normalizedTags.includes('DESHIDRATAT')) {
       return aiDate || this.addDays(today, 365);
    }

    // ... Resta de regles (Nevera, Rebost, Presets...) es mantenen igual ...
    // ... per als productes que NO siguin KM0 ...
    
    const lowerName = name.toLowerCase();
    const detectedCategory = this.detectCategoryFromPresets(lowerName);

    // REFRIGERATS
    const isRefrigerated = normalizedTags.includes('REFRIGERAT') || location === StorageLocation.FRIDGE;
    if (isRefrigerated) {
       // Carn/Peix
       if (detectedCategory === 'PROTEIN' || detectedCategory === 'MEAT' || detectedCategory === 'FISH') {
          return aiDate || this.addDays(today, 4);
       }
       // Làctics
       if (detectedCategory === 'DAIRY' || lowerName.includes('iogurt') || lowerName.includes('formatge')) {
          return aiDate || this.addDays(today, 21);
       }
       // Fruita/Verdura (No KM0)
       if (detectedCategory === 'FRUIT' || detectedCategory === 'VEGETABLE') {
           return aiDate || this.addDays(today, 10); 
       }
       return aiDate || this.addDays(today, 7);
    }

    // REBOST (PANTRY)
    if (location === StorageLocation.PANTRY) {
       if (detectedCategory === 'FRUIT' || detectedCategory === 'VEGETABLE') {
          return aiDate || this.addDays(today, 15);
       }
       if (detectedCategory === 'BAKERY' || lowerName.includes('pa ')) {
           return this.addDays(today, 3);
       }
       // Secs
       return aiDate || this.addDays(today, 365);
    }

    // FALLBACK
    return this.addDays(today, 7); 
  }

  // ... Helpers i detectCategoryFromPresets iguals que abans ...
  private static detectCategoryFromPresets(name: string): string | undefined {
      const found = FOOD_PRESETS.find(preset => {
          const pName = preset.id.toLowerCase();
          return name.includes(pName) || pName.includes(name);
      });
      return found?.category;
  }

  private static addDays(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }

  private static daysDiff(target: Date): number {
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }
}