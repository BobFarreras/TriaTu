import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';
import { ScannedItem } from '@/core/domain/types/ScannedItem';

export class FallbackImageRecognizer implements ImageRecognitionService {

    constructor(
        private readonly primary: ImageRecognitionService,
        private readonly secondary: ImageRecognitionService
    ) { }

    async analyze(imageBase64: string): Promise<ScannedItem[]> {
        try {
            // 1. Intentem el Primari (Gemini)
            // console.log('⚡ Provant Gemini...');
            const result = await this.primary.analyze(imageBase64);
            return result;

        } catch (error) {
            console.error('❌ Gemini ha fallat:', error);

            // 2. Si falla, activem el Secundari (OpenAI)
            console.warn('⚠️ Gemini ha fallat. Activant OpenAI (Fallback)...');

            try {
                return await this.secondary.analyze(imageBase64);
            } catch (secondaryError) {
                // 3. Si tot falla
                console.error('❌ OpenAI ha fallat:', secondaryError);

                console.error('💀 Error Crític: Tots els models han fallat.');
                return [];
            }
        }
    }
}