import { describe, it, expect, vi, type Mock } from 'vitest'; // <--- Importem 'Mock'
import { AddItem, AddItemInput } from '@/core/usecases/inventory/AddItem';
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/inventory/StorageLocation';


// Definim el mock typed manualment per evitar 'any' en la inicialització
const mockRepo = {
  save: vi.fn(),
  findById: vi.fn(),
  findByUser: vi.fn(),
  delete: vi.fn(),
  findExpiringSoon: vi.fn(),
} as unknown as InventoryRepository; 
// 'unknown' és més segur que 'any' com a pas intermedi per enganyar el compilador 
// quan creem objectes mock parcials.

describe('AddItem Use Case', () => {
  it('hauria de crear un nou item i guardar-lo al repositori', async () => {
    const useCase = new AddItem(mockRepo);

    const input: AddItemInput = {
      userId: 'user-123',
      name: 'Poma',
      quantity: 5,
      unit: 'unitats',
      location: StorageLocation.FRIDGE,
      addedAt: new Date()
    };

    await useCase.execute(input);

    // Verifiquem que s'ha cridat al repositori
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    
    // ✅ CORRECCIÓ: Casting segur a 'Mock' per accedir a .mock.calls
    const saveMock = mockRepo.save as Mock;
    const savedItem = saveMock.mock.calls[0][0] as InventoryItem;

    expect(savedItem).toBeInstanceOf(InventoryItem);
    expect(savedItem.props.name).toBe('Poma');
    expect(savedItem.props.quantity).toBe(5);
  });
});