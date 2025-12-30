import { ScannedItem } from "@/core/domain/types/ScannedItem";
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FOOD_PRESETS } from "@/lib/food-presets"; 

// ✅ DTO: Definim què esperem rebre de la IA (JSON cru)
// Tot és opcional (?) perquè no podem confiar cegament en la IA.
interface RawScannedItem {
  name?: string;
  emoji?: string;
  quantity?: number | string; // La IA a vegades torna strings "1"
  unit?: string;
  location?: string;
  expiryDate?: string | null;
  confidence?: number;
  box2d?: [number, number, number, number];
}

export class ScanSanitizer {
  
  // ✅ CANVI: Usem 'unknown' en lloc de 'any'
  static sanitize(item: unknown): ScannedItem {
    // Fem un "Type Assertion" segur perquè tractarem les dades defensivament
    const raw = item as RawScannedItem;

    console.log("🤖 [IA Output]:", raw.name, "| Emoji suggerit:", raw.emoji);

    const baseItem: ScannedItem = {
      name: this.cleanName(raw.name),
      quantity: this.validateQuantity(raw.quantity),
      emoji: raw.emoji || "📦", 
      unit: this.validateUnit(raw.unit),
      location: this.validateLocation(raw.location),
      // Convertim null a undefined per complir amb el tipus de domini
      expiryDate: raw.expiryDate ?? undefined,
      confidence: raw.confidence || 0,
      box2d: raw.box2d || [0, 0, 0, 0]
    };

    const enriched = this.enrichWithPreset(baseItem);
    
    console.log(`✨ [Final Result]: ${enriched.emoji} ${enriched.name}`);
    return enriched;
  }

  private static enrichWithPreset(item: ScannedItem): ScannedItem {
    const normalizedName = item.name.toLowerCase().trim();

    const match = FOOD_PRESETS.find(p => 
      normalizedName.includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(normalizedName)
    );

    if (match) {
      console.log(`🎯 Match trobat als Presets: ${match.name} (${match.emoji})`);
      return {
        ...item,
        name: item.name.length < 3 ? match.name : item.name, 
        emoji: match.emoji, 
        location: match.defaultLoc,
        unit: match.defaultUnit,
      };
    }

    console.log(`⚠️ Cap match per "${item.name}". Usem info de la IA.`);
    return item;
  }

  private static cleanName(name: string | undefined): string {
    if (!name || name.trim().length === 0) return 'Producte sense nom';
    const trimmed = name.trim().toLowerCase();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  // ✅ CANVI: 'unknown' en lloc de 'any'
  private static validateQuantity(qty: unknown): number {
    const n = Number(qty);
    return (!n || n <= 0 || isNaN(n)) ? 1 : n;
  }

  private static validateUnit(unit: string | undefined): 'ut' | 'kg' | 'l' | 'g' {
    if (!unit) return 'ut';
    const validUnits = ['ut', 'kg', 'l', 'g'];
    return validUnits.includes(unit) ? (unit as 'ut' | 'kg' | 'l' | 'g') : 'ut';
  }

  private static validateLocation(loc: string | undefined): StorageLocation {
    if (!loc) return StorageLocation.PANTRY;
    if (Object.values(StorageLocation).includes(loc as StorageLocation)) {
      return loc as StorageLocation;
    }
    return StorageLocation.PANTRY;
  }
}