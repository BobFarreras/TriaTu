import { DietaryRestriction } from "../value-objects/DietaryRestriction";

export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    emoji?: string;
    // Camps opcionals per vinculació
    linkedProductId?: string | null;
    linkedProductImage?: string | null;
    estimatedCost?: number | string;
}

export interface RecipeProps {
    id: string;
    authorId: string;
    name: string;
    ingredients: Ingredient[];
    steps: string[];
    tags: string[];
    dietaryTags: string[];
    prepTimeMinutes: number;
    createdAt: Date;
    likesCount: number;
    isPublic: boolean;
    estimatedCost?: number;
    authorName?: string;
    ratingSummary: {
        average: number;
        count: number;
        distribution: Record<number, number>;
    };
    isAiGenerated?: boolean;
    isFavorite?: boolean;
}

export class Recipe {
    constructor(public readonly props: RecipeProps) {
        // 🔥 Validem SEMPRE en crear
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
    get estimatedCost() { return this.props.estimatedCost; }
    get isAiGenerated() { return this.props.isAiGenerated; }
    get isFavorite() { return this.props.isFavorite ?? false; }
    get ratingSummary() { return this.props.ratingSummary; }
    get isPublic() { return this.props.isPublic; }

// 🔥 GETTERS QUE FALTAVEN I QUE EL MAPPER NECESSITA
    get createdAt() { return this.props.createdAt; }
    get likesCount() { return this.props.likesCount; }
    get authorName() { return this.props.authorName; }

    isSafeFor(restrictions: DietaryRestriction[]): boolean {
        if (!restrictions || restrictions.length === 0) return true;
        const normalizedRestrictions = restrictions.map(r => r.toLowerCase());
        const tags = (this.props.dietaryTags || []).map(t => t.toLowerCase());

        return normalizedRestrictions.every(restriction => {
            if (tags.includes(`${restriction}-free`)) return true;
            if (tags.includes(`sense ${restriction}`)) return true;
            if (tags.includes(`sense-${restriction}`)) return true;
            return true;
        });
    }

    toPrimitives(): RecipeProps {
        return {
            ...this.props,
            // Assegurem la còpia profunda i correcta dels ingredients
            ingredients: this.props.ingredients.map(i => ({
                id: i.id,
                name: i.name,
                quantity: i.quantity,
                unit: i.unit,
                emoji: i.emoji,
                linkedProductId: i.linkedProductId || null,
                linkedProductImage: i.linkedProductImage || null,
                estimatedCost: i.estimatedCost || 0
            }))
        };
    }

    private validate(): void {
        // 1. Validar Nom
        if (!this.props.name || this.props.name.trim().length < 3) {
            throw new Error("El nom ha de tenir almenys 3 caràcters");
        }

        // 2. Validar Ingredients
        if (!this.props.ingredients || this.props.ingredients.length === 0) {
            throw new Error("La recepta ha de tenir almenys un ingredient");
        }

        // 3. Validar consistència d'ingredients
        this.props.ingredients.forEach((ing, index) => {
            if (!ing.name || ing.name.trim() === '') {
                throw new Error(`L'ingredient a la posició ${index} no té nom`);
            }
            if (ing.quantity <= 0) {
                throw new Error(`L'ingredient "${ing.name}" ha de tenir una quantitat positiva`);
            }
        });

        // 🔥 4. NOVA VALIDACIÓ: Passos obligatoris
        // Això és el que farà passar el test que et falla
        if (!this.props.steps || this.props.steps.length === 0) {
            throw new Error("La recepta ha de tenir almenys un pas d'instruccions");
        }
    }
}