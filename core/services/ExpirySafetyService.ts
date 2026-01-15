import { StorageLocation } from "@/core/domain/entities/StorageLocation";


export class ExpirySafetyService {
  
  // ✅ AFEGIM EL PARÀMETRE 'tags'
  static applySafetyRules(name: string, location: string, aiDate?: string, tags: string[] = []): string {
    const today = new Date();
    const lowerName = name.toLowerCase();
    
    // Normalitzem els tags per evitar errors (majúscules/minúscules)
    const normalizedTags = tags.map(t => t.toUpperCase());

    // --- REGLA 0: ELS TAGS MANEN (Font de Veritat) ---
    
    // 1. Si té tag CONGELAT -> Freezer i 6 mesos (Indiscutible)
    if (normalizedTags.includes('CONGELAT')) {
       if (aiDate && this.daysDiff(new Date(aiDate)) > 90) return aiDate;
       return this.addDays(today, 180); 
    }

    // 2. Si té tag CONSERVA o SEC -> Rebost i 1-2 anys
    if (normalizedTags.includes('CONSERVA') || normalizedTags.includes('SEC') || normalizedTags.includes('DESHIDRATAT')) {
       return aiDate || this.addDays(today, 365); // 1 any mínim
    }

    // 3. Si té tag REFRIGERAT -> Nevera
    const isRefrigerated = normalizedTags.includes('REFRIGERAT') || location === StorageLocation.FRIDGE;

    if (isRefrigerated) {
       // Ara sí, mirem el nom per afinar (Carn vs Iogurt)
       // Però ja sabem segur que NO és una llauna perquè té el tag REFRIGERAT
       
       const meatKeywords = ['pollastre', 'carn', 'vedella', 'porc', 'hamburguesa', 'salsitxa', 'bistec', 'llom', 'aletes', 'conill', 'gall', 'indi'];
       const fishKeywords = ['peix', 'salmó', 'lluç', 'sípia', 'calamar', 'gambes', 'musclos', 'rap', 'bacallà', 'tonyina']; // Tonyina aquí només entrarà si té tag REFRIGERAT

       if (meatKeywords.some(k => lowerName.includes(k)) || fishKeywords.some(k => lowerName.includes(k))) {
          // Si és fresc i la data és > 5 dies, tallem.
          if (aiDate && this.daysDiff(new Date(aiDate)) > 5) return this.addDays(today, 3);
          return aiDate || this.addDays(today, 5);
       }

       // Iogurts i làctics refrigerats
       if (lowerName.includes('iogurt') || lowerName.includes('llet') || lowerName.includes('formatge')) {
          return aiDate || this.addDays(today, 21);
       }

       // Fruita/Verdura refrigerada
       return aiDate || this.addDays(today, 7);
    }

    // 4. Si no té tags especials i és PANTRY -> Assumim llarga durada
    // (Això arregla les llaunes que no tinguin tag explícit però no tinguin REFRIGERAT)
    if (location === StorageLocation.PANTRY) {
       return aiDate || this.addDays(today, 365);
    }

    return this.addDays(today, 7); // Fallback segur
  }

  // ... helpers (addDays, daysDiff) iguals que abans
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