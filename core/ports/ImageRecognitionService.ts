import { ScannedItem } from "@/core/domain/types/ScannedItem";

export interface ImageRecognitionService {
  /**
   * Rep una imatge (base64) i retorna una llista de possibles aliments detectats.
   */
  analyze(imageBase64: string): Promise<ScannedItem[]>;
}