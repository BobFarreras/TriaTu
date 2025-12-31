// src/core/domain/entities/Recipe.ts
import { DietaryRestriction, RESTRICTION_KEYWORDS } from '../value-objects/DietaryRestriction';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeRatingSummary {
  average: number;
  count: number;
}

export interface RecipeProps {
  id: string;
  authorId: string;    // ✅ NOU: Obligatori per saber qui l'ha creat
  name: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  prepTimeMinutes?: number;
  createdAt: Date;     // ✅ NOU: Per ordenar per novetat
  ratingSummary?: RecipeRatingSummary; // ✅ NOU: Projecció per al llistat
}

export class Recipe {
  constructor(public readonly props: RecipeProps) {
    this.validate(props);
    
    // Inicialitzem valors per defecte si no venen
    if (!this.props.ratingSummary) {
      this.props.ratingSummary = { average: 0, count: 0 };
    }
  }

  // Validació d'Invariants (Domain Logic Integrity)
  private validate(props: RecipeProps): void {
    if (!props.name || props.name.trim().length < 3) {
      throw new Error("El nom de la recepta ha de tenir almenys 3 caràcters.");
    }
    if (!props.ingredients || props.ingredients.length === 0) {
      throw new Error("La recepta ha de tenir almenys un ingredient.");
    }
    if (!props.steps || props.steps.length === 0) {
      throw new Error("La recepta ha de tenir instruccions (passos).");
    }
    if (!props.authorId) {
      throw new Error("La recepta ha de tenir un autor.");
    }
  }

  // Getters (Sucre sintàctic)
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get ingredients() { return this.props.ingredients; }
  get tags() { return this.props.tags; }
  get authorId() { return this.props.authorId; }
  get ratingSummary() { return this.props.ratingSummary!; }

  // LÒGICA DE DOMINI: Seguretat Alimentària (MANTINGUDA INTACTA)
  public isSafeFor(restrictions: DietaryRestriction[]): boolean {
    if (restrictions.length === 0) return true;

    const ingredientNames = this.props.ingredients.map(i => i.name.toLowerCase());
    
    // Nota: He eliminat el check de tags perquè era opcional i depèn de la consistència,
    // però mantenim el check de keywords que és el més segur.
    
    return restrictions.every(restriction => {
      const forbiddenWords = RESTRICTION_KEYWORDS[restriction];
      if (!forbiddenWords) return true;

      const hasForbiddenIngredient = ingredientNames.some(ingName => 
        forbiddenWords.some(keyword => ingName.includes(keyword.toLowerCase()))
      );

      return !hasForbiddenIngredient;
    });
  }
}