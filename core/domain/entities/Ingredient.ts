import { DietaryRestriction } from '../value-objects/DietaryRestriction';

export interface IngredientProps {
  name: string;
  quantity: number;
  unit: string;
}

export class Ingredient {
  props: IngredientProps;

  constructor(props: IngredientProps) {
    this.props = props;
  }

  get name(): string { return this.props.name; }
  get quantity(): number { return this.props.quantity; }
  get unit(): string { return this.props.unit; }

  // Mètode de domini per comprovar si aquest ingredient viola una restricció
  containsAllergen(restriction: DietaryRestriction, keywords: string[]): boolean {
    const normalizedName = this.name.toLowerCase();
    return keywords.some(keyword => normalizedName.includes(keyword));
  }
}