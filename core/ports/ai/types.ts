// core/infrastructure/ai/types.ts

// Aquest DTO representa estrictament el que la IA retorna (Infrastructure layer)
export interface AIRecipeDTO {
  name: string;
  ingredients: { 
    name: string; 
    quantity: number; 
    unit: string 
  }[];
  
  steps: string[];
  tags: string[];
  dietary_tags: string[]; // "gluten-free", "vegan", etc.
  prepTimeMinutes: number;
}