// ARXIU: core/domain/entities/Recipe.ts

import { DietaryRestriction } from "../value-objects/DietaryRestriction";

// ✅ 1. EXPORTEM LA INTERFÍCIE INGREDIENT
// Això permet que altres fitxers (com PublishRecipe.ts) la puguin importar
export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    emoji?: string;
}

export interface RecipeProps {
    id: string;
    authorId: string;
    name: string;
    ingredients: Ingredient[]; // ✅ Fem servir la interfície exportada
    steps: string[];
    tags: string[];
    dietaryTags: string[];
    prepTimeMinutes: number;
    createdAt: Date;
    likesCount: number;
    isPublic: boolean;
    estimatedCost?: number; // ✅ Afegeix això
    authorName?: string;    // ✅ Afegeix això
    ratingSummary: {
        average: number;
        count: number;
        distribution: Record<number, number>;
    };
    isAiGenerated?: boolean; // ✅ NOU
    isFavorite?: boolean; // ✅ NOU: Per saber si el cor ha d'estar vermell
}

export class Recipe {
    constructor(public readonly props: RecipeProps) {
        this.validate();
    }

    // Getters
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get ingredients() { return this.props.ingredients; }
    get authorId() { return this.props.authorId; }
    get steps() { return this.props.steps; }
    get tags() { return this.props.tags; }
    get dietaryTags() { return this.props.dietaryTags; }
    get prepTimeMinutes() { return this.props.prepTimeMinutes; }
    get createdAt() { return this.props.createdAt; }
    get likesCount() { return this.props.likesCount; }
    get isPublic() { return this.props.isPublic; }
    get ratingSummary() { return this.props.ratingSummary; }
    get isAiGenerated() { return this.props.isAiGenerated; }
    get isFavorite() { return this.props.isFavorite ?? false; }
    // 🧠 LÒGICA ACTUALITZADA PER SUPORTAR TAGS "SMART"
    isSafeFor(restrictions: DietaryRestriction[]): boolean {
        if (!restrictions || restrictions.length === 0) return true;

        const normalizedRestrictions = restrictions.map(r => r.toLowerCase());
        const ingredients = (this.props.ingredients || []).map(i => i.name.toLowerCase());
        const tags = (this.props.dietaryTags || []).map(t => t.toLowerCase());

        return normalizedRestrictions.every(restriction => {
            // 1. SAFE OVERRIDE (WHITELIST)
            if (tags.includes(`${restriction}-free`)) return true;
            if (tags.includes(`no-${restriction}`)) return true;

            // 2. DIET MATCHING (ADHERENCE)
            if (tags.includes(restriction)) return true;

            // 3. INGREDIENT CHECK (BLACKLIST)
            const hasBadIngredient = ingredients.some(ing => ing.includes(restriction));
            if (hasBadIngredient) return false;

            // 4. EXPLICIT DANGER TAGS
            if (tags.includes(`contains-${restriction}`)) return false;

            return true;
        });
    }

    validate(): void {
        if (!this.props.name || this.props.name.length < 3) {
            throw new Error("El nom ha de tenir almenys 3 caràcters.");
        }

        if (!this.props.ingredients || this.props.ingredients.length === 0) {
            throw new Error("La recepta ha de tenir almenys un ingredient.");
        }

        for (const ingredient of this.props.ingredients) {
            if (!ingredient.name || ingredient.quantity <= 0) {
                throw new Error("Ingredient invàlid: cal nom i quantitat positiva.");
            }
        }

        if (!this.props.steps || this.props.steps.length === 0) {
            throw new Error("La recepta ha de tenir instruccions (passos).");
        }
    }

    toPrimitives(): RecipeProps {
        return { ...this.props };
    }
}