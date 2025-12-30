import { StorageLocation } from "@/core/domain/entities/StorageLocation";

export interface ScannedItem {
  name: string;
  emoji: string; // ✅ AFEGEIX AIXÒ
  quantity: number;
  unit: 'ut' | 'kg' | 'l' | 'g';
  location: StorageLocation;
  expiryDate?: string; 
  confidence: number;
  // NOU: Coordenades per pintar la caixa (AR)
  // Format: [ymin, xmin, ymax, xmax] (valors de 0 a 1000 segons Gemini)
  box2d?: number[]; 
}