import { DietaryRestriction, RESTRICTION_KEYWORDS } from '../value-objects/DietaryRestriction';

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeProps {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  prepTimeMinutes?: number;
}

export class Recipe {
  constructor(public props: RecipeProps) {
    this.validate();
  }

  private validate() {
    if (!this.props.name) throw new Error("La recepta necessita un nom");
    if (!this.props.ingredients || this.props.ingredients.length === 0) {
      throw new Error("La recepta necessita ingredients");
    }
  }

  // --- LÒGICA DE SEGURETAT CRÍTICA ---
  // Retorna FALSE si troba algun ingredient prohibit
  isSafeFor(restrictions: DietaryRestriction[]): boolean {
    if (!restrictions || restrictions.length === 0) return true;

    for (const restriction of restrictions) {
      const forbiddenWords = RESTRICTION_KEYWORDS[restriction];
      
      // 1. Revisar cada ingredient
      const hasBadIngredient = this.props.ingredients.some(ing => {
        const ingName = ing.name.toLowerCase();
        return forbiddenWords.some(word => ingName.includes(word));
      });

      if (hasBadIngredient) return false;

      // 2. Revisar el títol (per seguretat extra)
      const titleCheck = forbiddenWords.some(word => 
        this.props.name.toLowerCase().includes(word)
      );
      
      if (titleCheck) return false;
    }

    return true;
  }
}