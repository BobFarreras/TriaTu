import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiImageRecognizer } from '@/adapters/gemini/GeminiImageRecognizer';

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent
      };
      // FIX: Canviem 'any' per 'unknown' per satisfer el linter
      constructor(options: unknown) {
        void options;
      }
    }
  };
});

describe('GeminiImageRecognizer Adapter', () => {
  let adapter: GeminiImageRecognizer;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new GeminiImageRecognizer();
  });

  it('debería transformar la respuesta JSON de Gemini en ScannedItems', async () => {
    const fakeItems = [
      {
        name: 'Poma Golden', // La IA envia això
        quantity: 6,
        unit: 'ut',
        location: 'FRIDGE',
        confidence: 0.99
      }
    ];

    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(fakeItems) 
    });

    const result = await adapter.analyze('base64-fake-image');

    expect(result).toHaveLength(1);
    // FIX: Esperem 'Poma golden' perquè el ScanSanitizer normalitza a minúscules excepte la primera
    expect(result[0].name).toBe('Poma golden'); 
    expect(result[0].location).toBe('FRIDGE');
  });

  it('debería lanzar error si Gemini falla (para que salte el Fallback)', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Google API Error'));
    await expect(adapter.analyze('base64-fake')).rejects.toThrow('Google API Error');
  });
});
