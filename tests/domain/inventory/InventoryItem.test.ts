import { describe, it, expect } from 'vitest';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';

describe('InventoryItem Entity', () => {
  const validProps = {
    id: '123',
    userId: 'user-abc',
    name: 'Llet Semidesnatada',
    quantity: 1,
    unit: 'litres',
    location: StorageLocation.FRIDGE,
    expiryDate: new Date('2025-12-31'),
    addedAt: new Date()
  };

  it('hauria de crear-se correctament amb dades vàlides', () => {
    const item = InventoryItem.create(validProps);
    expect(item.props.name).toBe('Llet Semidesnatada');
    expect(item.props.quantity).toBe(1);
  });

  it('hauria de llançar un error si la quantitat és negativa o zero', () => {
    // Cas negatiu
    expect(() => {
      InventoryItem.create({ ...validProps, quantity: -5 });
    }).toThrow(/positiva|negativa/); // Accepta ambdós missatges per seguretat

    // Cas zero
    expect(() => {
      InventoryItem.create({ ...validProps, quantity: 0 });
    }).toThrow(/positiva/);
  });

  it('hauria de detectar si un aliment està caducat', () => {
    const passat = new Date();
    passat.setDate(passat.getDate() - 5); 

    const item = InventoryItem.create({ ...validProps, expiryDate: passat });
    expect(item.isExpired()).toBe(true);
  });

  it('hauria de detectar si un aliment està a punt de caducar (dins de 3 dies)', () => {
    const dema = new Date();
    dema.setDate(dema.getDate() + 1);

    const item = InventoryItem.create({ ...validProps, expiryDate: dema });
    expect(item.isExpiringSoon(3)).toBe(true);
  });
});