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
      // DEBUG: Comprovem si arriba la imatge i quina mida té
      console.log(`📡 OpenAI: Rebent imatge de ${(imageBase64.length / 1024).toFixed(2)} KB`);

      // 1. Neteja robusta del Base64
      // De vegades arriba amb 'data:image/jpeg;base64,' i de vegades sense.
      const base64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
        : imageBase64;

      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        // FORCEM EL MODE JSON (Molt important per evitar errors de parseig)
        response_format: { type: "json_object" }, 
        messages: [
          {
            role: "system",
            content: `
              Ets un assistent expert en inventari.
              Analitza la imatge i retorna un JSON amb la clau "items".
              
              Si no trobes cap aliment, retorna: { "items": [] }
              
              TASQUES:
              1. Identifica l'aliment (name).
              2. Quantitat (quantity).
              3. Ubicació (location: FRIDGE, PANTRY, FREEZER).
              4. Caducitat (expiryDate YYYY-MM-DD). Si no la veus, estima-la.
              5. Bounding Box (box2d: [ymin, xmin, ymax, xmax]).
            `
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Retorna el JSON dels aliments detectats:" },
              { 
                type: "image_url", 
                image_url: { 
                  // Assegura't que el tipus MIME és correcte. JPEG sol ser el més segur.
                  url: `data:image/jpeg;base64,${base64Data}`,
                  detail: "high" // Força alta resolució
                } 
              },
            ],
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      console.log("🤖 OpenAI Raw Response:", content?.substring(0, 100) + "..."); // Loguegem l'inici per veure què diu

      if (!content) return [];

      const parsed = JSON.parse(content);
      // Gràcies al response_format, ara busquem la clau "items"
      const rawItems = parsed.items || [];

      console.log(`✅ OpenAI ha trobat ${rawItems.length} elements.`);

      return rawItems.map((item: unknown) => ScanSanitizer.sanitize(item as ScannedItem));

    } catch (error) {
      console.error("❌ OpenAI Error:", error);
      throw error;
    }
  }
}