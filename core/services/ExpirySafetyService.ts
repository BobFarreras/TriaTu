import { StorageLocation } from "@/core/domain/entities/StorageLocation";

export class ExpirySafetyService {
  
  static applySafetyRules(name: string, location: string, aiDate?: string): string {
    const today = new Date();
    const lowerName = name.toLowerCase();
    
    // Normalitzem location
    let loc = location as StorageLocation;
    if (!Object.values(StorageLocation).includes(loc)) loc = StorageLocation.PANTRY;

    // --- PARAULES CLAU ---
    const meatKeywords = ['pollastre', 'carn', 'vedella', 'porc', 'hamburguesa', 'salsitxa', 'botifarra', 'bistec', 'llom', 'aletes', 'pit', 'gall', 'indi', 'conill', 'costella', 'xai', 'mandonguilles'];
    const fishKeywords = ['peix', 'salmó', 'lluç', 'sípia', 'calamar', 'gambes', 'musclos', 'rap', 'bacallà', 'tonyina', 'sardina', 'llagostin', 'pop', 'dorada', 'lobarro'];
    
    const veggieKeywords = ['pebrot', 'tomàquet', 'enciam', 'pastanaga', 'ceba', 'patata', 'carbassó', 'albergínia', 'cogombre', 'bròquil', 'col', 'bledes', 'espinacs', 'xampinyons', 'bolets'];
    const fruitKeywords = ['poma', 'plàtan', 'taronja', 'llimona', 'pera', 'maduixa', 'fruita', 'raïm', 'meló', 'sindria', 'kiwi', 'préssec'];

    const deliKeywords = ['pernil', 'gall d\'indi', 'mortadella', 'fuet', 'xoriço', 'sobrassada', 'formatge fresc'];

    // ✅ MILLORA: PARAULES QUE INDIQUEN "REBOST" / "CONSERVA" (Excepcions a la regla de fresc)
    // Afegim: 'oli', 'escabetx', 'natural', 'pack', 'llauna', 'bossa' (patates), 'pot'
    const pantrySafeKeywords = [
        'llauna', 'conserva', 'pot', 'tetrabrik', 'uht', 'sec', 'deshidratat', 
        'arròs', 'pasta', 'llegum', 'cigrons', 'mongetes', 'llenties', 
        'oli', 'escabetx', 'vinagre', 'caldo', 'brou', 'crema', 'puré', 'galetes'
    ];

    // ✅ NOVA DETECCIÓ: Si el nom conté "en oli", "al natural", etc. sol ser conserva
    const isPreservedContext = 
        lowerName.includes('en oli') || 
        lowerName.includes('al natural') || 
        lowerName.includes('escabetx') ||
        lowerName.includes('de llauna');

    const isCannedOrDry = pantrySafeKeywords.some(k => lowerName.includes(k)) || isPreservedContext;


    // =========================================================
    // 1. REGLA SUPREMA: CONGELADOR
    // =========================================================
    if (loc === StorageLocation.FREEZER) {
      if (aiDate && this.daysDiff(new Date(aiDate)) > 60) return aiDate;
      return this.addDays(today, 180); // +6 mesos
    }

    // =========================================================
    // 2. REGLA: CARN I PEIX FRESC
    // =========================================================
    // ✅ CORRECCIÓ: Si és 'isCannedOrDry', SALTEM aquesta regla encara que digui 'Tonyina'
    if (!isCannedOrDry) {
        if (meatKeywords.some(k => lowerName.includes(k)) || fishKeywords.some(k => lowerName.includes(k))) {
            
            // Si està ubicat explícitament al REBOST, assumim que l'usuari sap què fa i que és conserva 
            // (Ex: "Tonyina" posada al rebost -> No la tractem com a fresca)
            if (loc === StorageLocation.PANTRY) {
                 // Si està al rebost, és conserva -> 1 any
                 return aiDate || this.addDays(today, 365);
            }

            // Si està a la NEVERA o sense ubicació clara -> Fresc -> 3 dies
            if (aiDate && this.daysDiff(new Date(aiDate)) > 5) {
                console.warn(`🚨 [SAFETY] Carn/Peix fresc amb data excessiva. Retallant.`);
                return this.addDays(today, 3);
            }
            return aiDate || this.addDays(today, 3);
        }
    }

    // =========================================================
    // 3. REGLA: VERDURA I FRUITA
    // =========================================================
    if (!isCannedOrDry && (veggieKeywords.some(k => lowerName.includes(k)) || fruitKeywords.some(k => lowerName.includes(k)))) {
        // Excepció: Si està al REBOST i són Patates/Cebes -> Poden durar més, però 1 any és massa.
        if (loc === StorageLocation.PANTRY) {
             return aiDate || this.addDays(today, 30); // 1 mes al rebost
        }
        
        // Fresc normal
        if (aiDate && this.daysDiff(new Date(aiDate)) > 30) {
             return this.addDays(today, 14); 
        }
        return aiDate || this.addDays(today, 10);
    }
    // =========================================================
    // 4. REGLA: XARCUTERIA I LÀCTICS OBERTS
    // =========================================================
    if (loc === StorageLocation.FRIDGE) {
        if (deliKeywords.some(k => lowerName.includes(k))) {
            return aiDate || this.addDays(today, 7); // 1 setmana
        }
        if (lowerName.includes('iogurt') || lowerName.includes('llet')) {
            // Llet fresca oberta dura poc, iogurt dura més. Mitjana segura:
            if (aiDate && this.daysDiff(new Date(aiDate)) > 45) {
                return this.addDays(today, 20); 
            }
            return aiDate || this.addDays(today, 14);
        }
    }

    // =========================================================
    // 5. DEFAULTS SEGONS UBICACIÓ (Si no sabem què és)
    // =========================================================
    
    // NEVERA DESCONEGUDA -> 1 Setmana (Més segur que 1 mes)
    if (loc === StorageLocation.FRIDGE) {
        return aiDate || this.addDays(today, 7);
    }

    // REBOST DESCONEGUT -> Aquí sí que podem ser més laxos, PERÒ...
    // Si hem arribat aquí, no és carn, ni peix, ni verdura coneguda.
    // Assumim que és conserva, pasta, arròs, etc.
    if (loc === StorageLocation.PANTRY) {
        if (!aiDate) return this.addDays(today, 365); // 1 any
        return aiDate;
    }

    return this.addDays(today, 7);
  }

  // --- HELPERS ---
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