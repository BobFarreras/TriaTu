import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'; // <--- Importem 'Mock'
import { ConsumeItem } from '@/core/usecases/inventory/ConsumeItem';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryRepository } from '@/core/ports/InventoryRepository';

const createMockItem = (qty: number) => InventoryItem.create({
  id: 'item-1',
  userId: 'u1',
  name: 'Arròs',
  quantity: qty,
  unit: 'kg',
  location: StorageLocation.PANTRY,
  addedAt: new Date()
});

describe('ConsumeItem Use Case', () => {
  let mockRepo: InventoryRepository;
  let useCase: ConsumeItem;

  beforeEach(() => {
    // Inicialitzem el mock sense 'any', usant un objecte literal i casting a 'unknown'
    mockRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
      findByUser: vi.fn(),
      findExpiringSoon: vi.fn(),
    } as unknown as InventoryRepository;
    
    useCase = new ConsumeItem(mockRepo);
  });

  it('hauria de reduir la quantitat si no s\'acaba del tot', async () => {
    // ✅ CORRECCIÓ: vi.mocked() és útil si importes el mòdul, però aquí tenim l'objecte.
    // Fem servir casting a Mock per configurar el valor de retorn.
    (mockRepo.findById as Mock).mockResolvedValue(createMockItem(2));

    await useCase.execute('item-1', 0.5); 

    expect(mockRepo.save).toHaveBeenCalled();
    
    // ✅ CORRECCIÓ: Casting segur per inspeccionar l'argument
    const saveMock = mockRepo.save as Mock;
    const savedItem = saveMock.mock.calls[0][0] as InventoryItem;
    
    expect(savedItem.props.quantity).toBe(1.5); 
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it('hauria d\'esborrar l\'item si la quantitat resultant és 0', async () => {
    (mockRepo.findById as Mock).mockResolvedValue(createMockItem(1));

    await useCase.execute('item-1', 1); 

    expect(mockRepo.delete).toHaveBeenCalledWith('item-1');
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('hauria de llançar error si l\'item no existeix', async () => {
    (mockRepo.findById as Mock).mockResolvedValue(null);

    await expect(useCase.execute('fake-id', 1)).rejects.toThrow('Item no trobat');
  });
});