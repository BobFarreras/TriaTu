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

      // Calculer la data d'avui per al prompt
      const today = new Date().toISOString().split('T')[0];

      // 2. EL SUPER-PROMPT MILLORAT
      const prompt = `
        Ets un sistema de visió artificial expert en inventari domèstic.

        OBJECTIU CRÍTIC:
        Detecta i localitza TOTS els aliments, begudes o envasos individuals a la imatge.

        REGLAS PER A CADA OBJECTE:
        1. **box2d (COORDENADES):** ÉS OBLIGATORI. Retorna la caixa delimitadora [ymin, xmin, ymax, xmax] en una escala de 0 a 1000.
        2. **expiryDate (CADUCITAT):**
           - Si hi ha una data impresa visible, USA-LA (format YYYY-MM-DD).
           - SI NO HI HA DATA, ESTIMA-LA basant-te en avui (${today}):
             * 🥫 Productes de rebost (Aigua, Conserves, Arròs, Pasta): Afegeix +2 ANYS.
             * 🥬 Frescos (Fruita, Verdura, Carn): Afegeix +1 SETMANA.
             * 🥛 Làctics/Oberts: Afegeix +3 DIES.
        
        FORMAT DE RESPOSTA (ARRAY JSON PUR):
        [
          {
            "name": "Nom curt en Català (ex: Ampolla d'Aigua)",
            "quantity": 1,
            "unit": "ut",
            "location": "PANTRY",
            "expiryDate": "2026-05-20", 
            "confidence": 0.9,
            "box2d": [100, 200, 500, 400] 
          }
        ]
        
        Retorna NOMÉS el JSON. Si no trobes res, retorna [].
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
      return rawItems.map(item => ScanSanitizer.sanitize(item as ScannedItem));

    } catch (error) {
      console.warn("⚠️ Gemini ha fallat:", error);
      throw error;
    }
  }
}