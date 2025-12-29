import { ScannedItem } from "@/core/domain/types/ScannedItem";
import { StorageLocation } from "@/core/domain/entities/StorageLocation";

export class ScanSanitizer {
  
  static sanitize(item: ScannedItem): ScannedItem {
    return {
      name: this.cleanName(item.name),
      quantity: this.validateQuantity(item.quantity),
      unit: this.validateUnit(item.unit),
      location: this.validateLocation(item.location),
      expiryDate: item.expiryDate,
      confidence: item.confidence
    };
  }

  private static cleanName(name: string): string {
    if (!name || name.trim().length === 0) return 'Producte sense nom';
    
    // Treure espais i posar primera lletra majúscula
    const trimmed = name.trim().toLowerCase();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  private static validateQuantity(qty: number): number {
    if (!qty || qty <= 0 || isNaN(qty)) return 1;
    return qty;
  }

  private static validateUnit(unit: string): 'ut' | 'kg' | 'l' | 'g' {
    const validUnits = ['ut', 'kg', 'l', 'g'];
    if (validUnits.includes(unit)) {
      return unit as 'ut' | 'kg' | 'l' | 'g';
    }
    return 'ut'; // Fallback segur
  }

  private static validateLocation(loc: string): StorageLocation {
    // Comprovem si el string coincideix amb algun valor de l'Enum
    if (Object.values(StorageLocation).includes(loc as StorageLocation)) {
      return loc as StorageLocation;
    }
    // Per defecte, si no sabem on va, al Revost
    return StorageLocation.PANTRY;
  }
}