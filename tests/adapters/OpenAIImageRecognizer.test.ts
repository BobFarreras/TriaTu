import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIImageRecognizer } from '@/adapters/openai/OpenAIImageRecognizer';

// 1. Definim el mock function fora
const mockCreate = vi.fn();

// 2. Mockegem el mòdul
vi.mock('openai', () => {
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate
        }
      };
      constructor(options: unknown) {
        void options;
      }
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
    // CANVI 1: L'estructura ara ha de tenir la clau "items"
    const fakeJsonResponse = JSON.stringify({
      items: [
        {
          name: 'Plàtan',
          quantity: 5,
          unit: 'ut',
          location: 'PANTRY',
          confidence: 0.95,
          box2d: [0, 0, 100, 100] // Afegim coordenades dummy per complir el tipus
        }
      ]
    });

    // CANVI 2: Simulem resposta JSON neta (sense Markdown ```json)
    // OpenAI amb mode json_object NO torna markdown.
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: fakeJsonResponse // Passem el JSON net directament
          }
        }
      ]
    });

    const result = await adapter.analyze('base64-fake-image');

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Plàtan');
    expect(result[0].quantity).toBe(5);
  });

  it('hauria de retornar array buit (o llençar error) si falla', async () => {
    mockCreate.mockRejectedValue(new Error('API Error'));

    await expect(adapter.analyze('base64-fake')).rejects.toThrow('API Error');
  });
});
