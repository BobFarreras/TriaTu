import { GoogleGenAI } from "@google/genai";
import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ScanSanitizer } from '@/core/domain/services/ScanSanitizer';

export class GeminiImageRecognizer implements ImageRecognitionService {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyze(imageBase64: string): Promise<ScannedItem[]> {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");


      const prompt = `
        Ets un sistema de visió artificial avançat per a inventari de cuina.
        
        OBJECTIU PRINCIPAL:
        Detecta TOTS els aliments, begudes o envasos individuals a la imatge.
        PER A CADA OBJECTE DETECTAT ÉS **OBLIGATORI** RETORNAR LES SEVES COORDENADES "box2d".

        REGLAS DE CADUCITAT (expiryDate):
        - Si veus una data impresa clara (ex: "EXP 12/25"), USA-LA (format YYYY-MM-DD).
        - SI NO VEUS DATA, ESTIMA-LA basant-te en el tipus de producte i la data d'avui (${new Date().toISOString().split('T')[0]}):
          * 💧 Aigua, Conserves, Pasta seca, Arròs: LLARGA DURADA (+1 o +2 anys). NO POSIS DATA D'AVUI.
          * 🥬 Verdura fresca, Fruita, Carn crua: CURTA DURADA (+3 a +7 dies).
          * 🥛 Làctics oberts, Plats preparats: MOLT CURTA (+2 a +4 dies).

        FORMAT DE RESPOSTA (ARRAY JSON PUR):
        [
          {
            "name": "Nom curt en Català (ex: Ampolla Aigua 1.5L)",
            "quantity": número (mínim 1),
            "unit": "ut" | "kg" | "l",
            "location": "FRIDGE" | "PANTRY" | "FREEZER",
            "expiryDate": "YYYY-MM-DD" (o null si és impossible estimar, PERÒ MAI LA DATA D'AVUI per productes de llarga durada),
            "confidence": 0.5 a 1.0,
            "box2d": [ymin, xmin, ymax, xmax]  <-- COORDENADES OBLIGATÒRIES (escala 0-1000)
          }
        ]
        
        Si no detectes cap aliment, retorna un array buit [].
      `;


      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
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
        }
      });

      // --- CORRECCIÓN AQUÍ ---
      // 1. Accedemos a la propiedad .text (sin paréntesis)
      // 2. Usamos '?' para evitar el error de "posiblemente undefined"
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
        throw new Error('Invalid JSON from Gemini');
      }

      return rawItems.map(item => ScanSanitizer.sanitize(item as ScannedItem));

    } catch (error) {
      console.warn("⚠️ Gemini ha fallado:", error);
      throw error;
    }
  }
}