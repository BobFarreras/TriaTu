'use server';

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ProductMatcherService } from '@/core/application/services/ProductMatcherService'; // Import nou
import { logActionError } from '@/lib/observability/action-logger';
import { getCurrentUser } from '@/lib/auth/session';

export type ScanResult = 
  | { success: true; items: ScannedItem[] }
  | { success: false; error: string };

export async function scanImageAction(formData: FormData): Promise<ScanResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();
    const file = formData.get('image');
    if (!file || !(file instanceof File)) return { success: false, error: 'No image' };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    // 1. RECONEIXEMENT VISUAL (Gemini)
    // "Veig un paquet de llet i unes galetes"
    const recognizer = container.getImageRecognizer();
    const genericItems = await recognizer.analyze(base64);

    if (genericItems.length === 0) {
        return { success: true, items: [] };
    }

    // 2. ENRIQUIMENT DE DADES (Matcher)
    // "El paquet de llet correspon a l'ID 5543 de Bonpreu"
    // (Instancia el servei aquí o al container)
    const matcher = new ProductMatcherService(container.getProductCatalogRepo(supabase));
    const enrichedItems = await matcher.enrichItems(genericItems);

    return { success: true, items: enrichedItems };

  } catch (error) {
    logActionError('scanImageAction', 'Scan action failed', error);
    return { success: false, error: 'Failed to analyze image' };
  }
}
