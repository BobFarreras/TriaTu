import { ScannedItem } from "@/core/domain/types/ScannedItem";
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FOOD_PRESETS } from "@/lib/food-presets";

// Definim el que esperem rebre de la IA per evitar l'any
interface RawScannedItem {
  name?: string;
  emoji?: string;
  quantity?: number;
  unit?: string;
  location?: string;
  expiryDate?: string | null;
  confidence?: number;
  box2d?: [number, number, number, number];
}

export class ScanSanitizer {
  
  static sanitize(item: unknown): ScannedItem {
    // Fem un cast segur de unknown a la nostra interfície base
    const raw = item as RawScannedItem;

    // 1. Primer creem l'objecte base amb valors per defecte robustos
    const sanitized: ScannedItem = {
      name: this.cleanName(raw.name || ""),
      emoji: raw.emoji || "📦",
      quantity: this.validateQuantity(raw.quantity ?? 1),
      unit: this.validateUnit(raw.unit || "ut"),
      location: this.validateLocation(raw.location || "PANTRY"),
      expiryDate: raw.expiryDate ?? undefined,
      confidence: raw.confidence || 0,
      box2d: raw.box2d || [0, 0, 0, 0]
    };

    // 2. Intentem enriquir-lo amb els Presets
    return this.enrichWithPreset(sanitized);
  }

  private static enrichWithPreset(item: ScannedItem): ScannedItem {
    const normalizedName = item.name.toLowerCase().trim();

    const match = FOOD_PRESETS.find(p => 
      normalizedName.includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(normalizedName)
    );

    if (match) {
      return {
        ...item,
        name: item.name.length < 3 ? match.name : item.name, 
        emoji: match.emoji, // Prioritat al nostre disseny
        location: match.defaultLoc,
        unit: match.defaultUnit,
      };
    }

    return item;
  }

  private static cleanName(name: string): string {
    if (!name || name.trim().length === 0) return 'Producte sense nom';
    const trimmed = name.trim().toLowerCase();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  private static validateQuantity(qty: number): number {
    return (!qty || qty <= 0 || isNaN(qty)) ? 1 : qty;
  }

  private static validateUnit(unit: string): 'ut' | 'kg' | 'l' | 'g' {
    const validUnits = ['ut', 'kg', 'l', 'g'];
    return validUnits.includes(unit) ? (unit as 'ut' | 'kg' | 'l' | 'g') : 'ut';
  }

  private static validateLocation(loc: string): StorageLocation {
    const validLocations = Object.values(StorageLocation);
    return validLocations.includes(loc as StorageLocation) 
      ? (loc as StorageLocation) 
      : StorageLocation.PANTRY;
  }
}