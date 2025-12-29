import { describe, it, expect } from 'vitest';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { ScanSanitizer } from '@/core/domain/services/ScanSanitizer';
import { ScannedItem } from '@/core/domain/types/ScannedItem';

describe('ScanSanitizer Service', () => {
  
  it('hauria de netejar espais en blanc i capitalitzar el nom', () => {
    // Utilitzem 'as ScannedItem' per confirmar que aquest objecte compleix la interfície
    const dirtyItem = {
      name: '  poma verda  ',
      quantity: 1,
      unit: 'ut',
      location: StorageLocation.FRIDGE,
      confidence: 0.9
    } as ScannedItem; 

    const clean = ScanSanitizer.sanitize(dirtyItem);
    expect(clean.name).toBe('Poma verda');
  });

  it('hauria de corregir quantitats negatives o zero', () => {
    const invalidQtyItem = {
      name: 'Llet',
      quantity: -5,
      unit: 'l',
      location: StorageLocation.FRIDGE,
      confidence: 0.8
    } as ScannedItem;

    const clean = ScanSanitizer.sanitize(invalidQtyItem);
    expect(clean.quantity).toBe(1); // Per defecte 1
  });

  it('hauria d\'assignar una ubicació per defecte si ve buida o invàlida', () => {
    // Aquí fem trampes expressament: Passem un string invàlid 'UNKNOWN'
    // Usem 'as unknown as StorageLocation' per enganyar TypeScript només en aquest test
    const lostItem = {
      name: 'Arròs',
      quantity: 1,
      unit: 'kg',
      location: 'UNKNOWN' as unknown as StorageLocation, 
      confidence: 0.5
    } as ScannedItem;

    const clean = ScanSanitizer.sanitize(lostItem);
    expect(clean.location).toBe(StorageLocation.PANTRY); // Default fallback
  });

  it('hauria de normalitzar unitats desconegudes a "ut"', () => {
    // El mateix aquí: Passem 'boxes' que no existeix al tipus
    const weirdUnitItem = {
      name: 'Pa',
      quantity: 1,
      unit: 'boxes' as unknown as 'ut', // Casting doble per saltar la validació estàtica
      location: StorageLocation.PANTRY,
      confidence: 1
    } as ScannedItem;

    const clean = ScanSanitizer.sanitize(weirdUnitItem);
    expect(clean.unit).toBe('ut');
  });
});