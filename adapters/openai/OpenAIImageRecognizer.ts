import OpenAI from 'openai';
import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ScanSanitizer } from '@/core/domain/services/ScanSanitizer';

export class OpenAIImageRecognizer implements ImageRecognitionService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyze(imageBase64: string): Promise<ScannedItem[]> {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
        Ets un assistent expert en inventari domèstic i seguretat alimentària.
        Analitza la imatge, detecta cada aliment individualment i extreu les seves dades.

        TASQUES:
        1. Identifica l'aliment (Nom en Català).
        2. Estima la quantitat.
        3. Detecta la ubicació ideal (Nevera, Revost, Congelador).
        4. CADUCITAT INTEL·LIGENT:
           - Si veus una data impresa, usa-la (format YYYY-MM-DD).
           - SI NO VEUS DATA, ESTIMA-LA basant-te en el tipus d'aliment fresc.
             Exemple: Enciam ~5 dies des d'avui. Carn fresca ~3 dies. Arròs ~365 dies.
             Calcula la data aproximada sumant dies a la data d'avui: ${new Date().toISOString().split('T')[0]}.
        5. DETECCIÓ VISUAL (Bounding Box):
           - Retorna les coordenades de la caixa que envolta l'objecte.
           - Format: [ymin, xmin, ymax, xmax] (escala 0-1000).

        RETORNA NOMÉS UN ARRAY JSON:
        [{ 
          "name": "Poma Fuji", 
          "quantity": 3, 
          "unit": "ut", 
          "location": "FRIDGE", 
          "expiryDate": "2024-10-25", 
          "confidence": 0.95,
          "box2d": [150, 300, 450, 600] 
        }]
      `
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Llista els aliments:" },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } },
            ],
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return [];

      // ✅ FIX: Netegem els blocs de codi Markdown abans de parsejar
      const cleanJson = content.replace(/```json|```/g, '').trim();

      const parsed = JSON.parse(cleanJson);
      const rawItems = Array.isArray(parsed) ? parsed : (parsed.items || []);

      return rawItems.map((item: unknown) => ScanSanitizer.sanitize(item as ScannedItem));

    } catch (error) {
      console.error("❌ OpenAI també ha fallat:", error);
      throw error; // Llancem l'error perquè el test ho detecti
    }
  }
}