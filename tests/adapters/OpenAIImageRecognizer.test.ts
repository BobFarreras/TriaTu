import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIImageRecognizer } from '@/adapters/openai/OpenAIImageRecognizer';

// 1. Definim el mock function fora
const mockCreate = vi.fn();

// 2. Mockegem el mòdul retornant una CLASSE real
vi.mock('openai', () => {
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate
        }
      };
      // El constructor és necessari perquè funcioni 'new OpenAI()'
      constructor(options: unknown) {}
    }
  };
});

describe('OpenAIImageRecognizer Adapter', () => {
  let adapter: OpenAIImageRecognizer;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new OpenAIImageRecognizer();
  });

  it('hauria de transformar la resposta JSON d\'OpenAI en ScannedItems', async () => {
    const fakeJsonResponse = JSON.stringify([
      {
        name: 'Plàtan',
        quantity: 5,
        unit: 'ut',
        location: 'PANTRY',
        confidence: 0.95
      }
    ]);

    // Simulem que OpenAI retorna Markdown (que ara el codi ja sap netejar)
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: `\`\`\`json\n${fakeJsonResponse}\n\`\`\``
          }
        }
      ]
    });

    const result = await adapter.analyze('base64-fake-image');

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Plàtan');
  });

  it('hauria de retornar array buit (o llençar error) si falla', async () => {
    mockCreate.mockRejectedValue(new Error('API Error'));

    // Com que al codi hem posat 'throw error', aquí esperem que peti
    await expect(adapter.analyze('base64-fake')).rejects.toThrow('API Error');
  });
});