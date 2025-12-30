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
      const today = new Date().toISOString().split('T')[0];
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        // FORCEM EL MODE JSON (Molt important per evitar errors de parseig)
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `
              Ets un sistema de visió artificial d'elit per a la gestió de rebosts.
OBJECTIU: Identificar cada aliment, beguda o envàs individualment amb precisió quirúrgica.

AVUI ÉS: ${today}

INSTRUCCIONS PER A CADA OBJECTE:
1. **name**: Nom precís en Català (ex: "Llet semidesnatada", "Iogurt de maduixa").
2. **emoji**: Selecciona l'emoji Unicode més específic possible. 
   - Ex: 🫒 per oli, 🥛 per llet, 🍪 per galetes, 🥩 per carn.
3. **box2d**: Coordenades exactes [ymin, xmin, ymax, xmax] de 0 a 1000. No facis caixes massa grans.
4. **unit**: 'ut' per unitats/envasos, 'kg' o 'g' per pes, 'l' per líquids.
5. **location**: Tria només entre: 'FRIDGE' (nevera), 'FREEZER' (congelador) o 'PANTRY' (estanteria/rebost).
6. **expiryDate**: 
   - Busca una data a l'envàs.
   - Si no n'hi ha, estima segons el tipus:
     - Conserves/Pasta/Arròs: +2 anys des d'avui.
     - Productes oberts o frescos: +5 dies des d'avui.
     - Productes en nevera: +10 dies des d'avui.

FORMAT DE RESPOSTA (ARRAY JSON PUR):
[{
  "name": "Oli d'Oliva Verge",
  "emoji": "🫒",
  "quantity": 1,
  "unit": "l",
  "location": "PANTRY",
  "expiryDate": "2027-12-30",
  "confidence": 0.98,
  "box2d": [100, 250, 450, 400]
}]

RESPOSTA OBLIGATÒRIA: Només l'array JSON. Si la imatge està buida o no conté aliments, retorna [].
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