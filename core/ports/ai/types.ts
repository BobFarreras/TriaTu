// core/infrastructure/ai/types.ts

// Aquest DTO representa estrictament el que la IA retorna (Infrastructure layer)
export interface AIRecipeDTO {
  name: string;
  prep_time_minutes: number; // Forcem que sigui número
  total_estimated_cost?: number; // ✅ Opcional perquè potser la IA no ho posa
  ingredients: {
    name: string;
    quantity: number | string;
    unit: string;
    emoji?: string; // ✅ Opcional
  }[];
  steps: string[];
  tags?: string[];
  dietary_tags?: string[];
}