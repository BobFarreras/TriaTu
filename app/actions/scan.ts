'use server';

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { ScannedItem } from '@/core/domain/types/ScannedItem';

// Definim el tipus de retorn per a tipatge fort al client
export type ScanResult = 
  | { success: true; items: ScannedItem[] }
  | { success: false; error: string };

export async function scanImageAction(formData: FormData): Promise<ScanResult> {
  try {
    // 1. Seguretat: Usuari autenticat?
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // 2. Obtenir la imatge del FormData
    const file = formData.get('image');
    
    // Validació estricta de fitxer
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No image provided' };
    }

    // 3. Convertir File a Base64 (necessari per a les APIs d'IA)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    // 4. Cridar al servei d'IA (Estratègia Fallback automàtica)
    const recognizer = container.getImageRecognizer();
    
    // Aquesta crida pot trigar uns segons
    const items = await recognizer.analyze(base64);

    return { success: true, items };

  } catch (error) {
    console.error('Scan Action Error:', error);
    return { success: false, error: 'Failed to analyze image' };
  }
}