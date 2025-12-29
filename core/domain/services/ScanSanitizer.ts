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
      confidence: item.confidence,
      // 👇 AFEGEIX AIXÒ! Si no ho posem, es perd pel camí
      box2d: item.box2d 
    };
  }

  // ... (resta de mètodes privats igual que abans: cleanName, validateQuantity, etc.)
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
    if (Object.values(StorageLocation).includes(loc as StorageLocation)) {
      return loc as StorageLocation;
    }
    return StorageLocation.PANTRY;
  }
}