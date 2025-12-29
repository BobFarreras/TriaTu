import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'; // <--- 1. Importem 'Mock'
import { FallbackImageRecognizer } from '@/adapters/strategies/FallbackImageRecognizer';
import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';

describe('FallbackImageRecognizer Strategy', () => {
  let strategy: FallbackImageRecognizer;
  let mockPrimary: ImageRecognitionService;
  let mockSecondary: ImageRecognitionService;

  beforeEach(() => {
    // 2. Inicialitzem usant 'unknown' com a pont segur en lloc de 'any'
    // Això permet assignar un objecte amb vi.fn() a una variable que espera la interfície completa
    mockPrimary = { analyze: vi.fn() } as unknown as ImageRecognitionService;
    mockSecondary = { analyze: vi.fn() } as unknown as ImageRecognitionService;
    
    strategy = new FallbackImageRecognizer(mockPrimary, mockSecondary);
  });

  it('hauria d\'usar el primari si funciona correctament', async () => {
    // 3. Substituïm 'as any' per 'as Mock'
    (mockPrimary.analyze as Mock).mockResolvedValue([{ name: 'Primari' }]);
    
    const result = await strategy.analyze('img');
    
    expect(result[0].name).toBe('Primari');
    expect(mockPrimary.analyze).toHaveBeenCalled();
    expect(mockSecondary.analyze).not.toHaveBeenCalled();
  });

  it('hauria d\'usar el secundari si el primari falla', async () => {
    (mockPrimary.analyze as Mock).mockRejectedValue(new Error('Fail'));
    (mockSecondary.analyze as Mock).mockResolvedValue([{ name: 'Secundario' }]);
    
    const result = await strategy.analyze('img');
    
    expect(result[0].name).toBe('Secundario'); // Ha saltat al backup
    expect(mockPrimary.analyze).toHaveBeenCalled();
    expect(mockSecondary.analyze).toHaveBeenCalled();
  });

  it('hauria de tornar buit si ambdós fallen', async () => {
    (mockPrimary.analyze as Mock).mockRejectedValue(new Error('Fail 1'));
    (mockSecondary.analyze as Mock).mockRejectedValue(new Error('Fail 2'));
    
    const result = await strategy.analyze('img');
    
    expect(result).toEqual([]); // Fallada total controlada
  });
});