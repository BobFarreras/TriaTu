// ARXIU: tests/core/usecases/inventory/ConsumeItem.test.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ConsumeItem } from '@/core/usecases/inventory/ConsumeItem';
import { InventoryItem, InsufficientStockError } from '@/core/domain/entities/InventoryItem'; // Importem l'error
import { StorageLocation } from '@/core/domain/entities/StorageLocation'; // Assegura't que la ruta és correcta
import { InventoryRepository } from '@/core/ports/InventoryRepository';

// ... Helper createMockItem igual que abans ...
const createMockItem = (qty: number) => InventoryItem.create({
  id: 'item-1',
  userId: 'u1',
  name: 'Arròs',
  quantity: qty,
  unit: 'kg',
  location: StorageLocation.PANTRY, // Assegura't que aquest enum existeix o fes servir un string 'pantry'
  addedAt: new Date()
});

describe('ConsumeItem Use Case', () => {
  let mockRepo: InventoryRepository;
  let useCase: ConsumeItem;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
      findByUser: vi.fn(),
      findExpiringSoon: vi.fn(),
      batchUpdate: vi.fn(),
      batchDelete: vi.fn(),
    } as unknown as InventoryRepository;
    
    useCase = new ConsumeItem(mockRepo);
  });

  it('hauria de reduir la quantitat si no s\'acaba del tot', async () => {
    (mockRepo.findById as Mock).mockResolvedValue(createMockItem(2));

    await useCase.execute('item-1', 0.5); 

    expect(mockRepo.save).toHaveBeenCalled();
    const saveMock = mockRepo.save as Mock;
    const savedItem = saveMock.mock.calls[0][0] as InventoryItem;
    expect(savedItem.props.quantity).toBe(1.5); 
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it('hauria d\'esborrar l\'item si la quantitat resultant és 0', async () => {
    (mockRepo.findById as Mock).mockResolvedValue(createMockItem(1));

    await useCase.execute('item-1', 1); // 1 - 1 = 0

    expect(mockRepo.delete).toHaveBeenCalledWith('item-1');
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  // ✅ NOU TEST PER AL PROBLEMA 1
  it('hauria de llançar InsufficientStockError si demanem més del que hi ha', async () => {
    (mockRepo.findById as Mock).mockResolvedValue(createMockItem(0.5)); // Tenim 0.5

    // Intentem consumir 1.0 -> Hauria de fallar, no esborrar
    await expect(useCase.execute('item-1', 1.0))
        .rejects
        .toThrow(InsufficientStockError);

    // Verifiquem que no s'ha tocat res
    expect(mockRepo.delete).not.toHaveBeenCalled();
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('hauria de llançar error si l\'item no existeix', async () => {
    (mockRepo.findById as Mock).mockResolvedValue(null);
    await expect(useCase.execute('fake-id', 1)).rejects.toThrow('Item no trobat');
  });
});