import { DietaryRestriction, RESTRICTION_KEYWORDS } from '../value-objects/DietaryRestriction';

export interface RecipeProps {
    id: string;
    name: string;
    ingredients: { name: string; quantity: number; unit: string }[];
    steps: string[];
    tags: string[];
    prepTimeMinutes?: number;
}

export class Recipe {
    constructor(public readonly props: RecipeProps) {}

    // Getters per facilitar l'accés (sucre sintàctic)
    get name() { return this.props.name; }
    get ingredients() { return this.props.ingredients; }
    get tags() { return this.props.tags; }
    get prepTimeMinutes() { return this.props.prepTimeMinutes; }

    // LÒGICA DE DOMINI: Seguretat Alimentària
    public isSafeFor(restrictions: DietaryRestriction[]): boolean {
        // Si no hi ha restriccions, és segur per defecte
        if (restrictions.length === 0) return true;

        const ingredientNames = this.props.ingredients.map(i => i.name.toLowerCase());
        const recipeTags = this.props.tags.map(t => t.toLowerCase());

        return restrictions.every(restriction => {
            // 1. Check de Tags positius (ex: si és VEGAN, ha de tenir tag 'vegan')
            // (Això depèn de com vinguin els teus tags, de moment ho deixem permissiu o ho implementes estricte)
            // if (restriction === DietaryRestriction.VEGAN && !recipeTags.includes('vegan')) return false;

            // 2. Check de Paraules Prohibides (Keywords)
            const forbiddenWords = RESTRICTION_KEYWORDS[restriction];
            
            if (!forbiddenWords) return true; // Si no tenim paraules definides, assumim segur

            // Mirem si algun ingredient conté alguna paraula prohibida
            const hasForbiddenIngredient = ingredientNames.some(ingName => 
                forbiddenWords.some(keyword => ingName.includes(keyword.toLowerCase()))
            );

            return !hasForbiddenIngredient;
        });
    }
}