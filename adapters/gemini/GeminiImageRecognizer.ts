import { GoogleGenAI } from "@google/genai";
import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ScanSanitizer } from '@/core/domain/services/ScanSanitizer';

export class GeminiImageRecognizer implements ImageRecognitionService {
  private client: GoogleGenAI;

  constructor() {
    // Assegura't de tenir GEMINI_API_KEY al .env.local
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyze(imageBase64: string): Promise<ScannedItem[]> {
    try {
      // 1. Netejar base64
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      // Dins de GeminiImageRecognizer.ts, substitueix la variable prompt:

      const today = new Date().toISOString().split('T')[0];

      const prompt = `
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
`;

      // 3. Cridar a l'API (Usem el model Pro per millor visió si pots, sino el flash)
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash', // El model Pro és millor per a coordenades
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Baixa temperatura per ser més precís
        }
      });

      // 4. Parseig segur
      const text = response?.text;

      if (!text) {
        console.warn("Gemini ha devuelto una respuesta vacía.");
        return [];
      }

      let rawItems: unknown[] = [];
      try {
        rawItems = JSON.parse(text);
        console.log("🔍 [IA RAW OUTPUT]:", JSON.stringify(rawItems, null, 2));
        if (!Array.isArray(rawItems)) rawItems = [];
      } catch (e) {
        console.error("Gemini JSON Parse Error:", e);
        // Si falla el JSON mode, intentem netejar markdown per si de cas
        try {
          const cleanText = text.replace(/```json|```/g, '').trim();
          rawItems = JSON.parse(cleanText);
        } catch (e2) {
          console.log(e2)
          throw new Error('Invalid JSON from Gemini');
        }
      }

      // 5. Sanitize via Domini
      return rawItems.map((item: unknown) => {
        const sanitized = ScanSanitizer.sanitize(item as ScannedItem);
        console.log(`🧼 [SANITIZED]: ${sanitized.name} | Emoji: ${sanitized.emoji}`);
        return sanitized;
      });
    } catch (error) {
      console.warn("⚠️ Gemini ha fallat:", error);
      throw error;
    }
  }
}