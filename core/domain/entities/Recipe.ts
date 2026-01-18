import { DietaryRestriction } from "../value-objects/DietaryRestriction";

// ✅ 1. ASSEGURAR QUE LA INTERFÍCIE INCLOU ELS CAMPS NOUS
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  emoji?: string;
  
  // Camps opcionals per vinculació amb inventari
  linkedProductId?: string | null;     // ID del producte real
  linkedProductImage?: string | null;  // Imatge
  estimatedCost?: number;              // Cost calculat
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
    get estimatedCost() { return this.props.estimatedCost; }
    get isAiGenerated() { return this.props.isAiGenerated; }
    get authorName() { return this.props.authorName; }
    get isFavorite() { return this.props.isFavorite ?? false; }
    get ratingSummary() { return this.props.ratingSummary; }

    isSafeFor(restrictions: DietaryRestriction[]): boolean {
        if (!restrictions || restrictions.length === 0) return true;
        const normalizedRestrictions = restrictions.map(r => r.toLowerCase());
        const tags = (this.props.dietaryTags || []).map(t => t.toLowerCase());
        return normalizedRestrictions.every(restriction => {
            if (tags.includes(`${restriction}-free`)) return true;
            if (tags.includes(`no-${restriction}`)) return true;
            if (tags.includes(restriction)) return true;
            if (tags.includes(`contains-${restriction}`)) return false;
            return true;
        });
    }

    validate(): void {
        if (!this.props.name) throw new Error("Nom obligatori");
    }

    // 🚨🚨🚨 AQUÍ ESTAVA L'ERROR 🚨🚨🚨
    toPrimitives(): RecipeProps {
        return {
            ...this.props,
            // Hem d'assegurar que els ingredients es mapegen completament
            ingredients: this.props.ingredients.map(i => ({
                id: i.id,
                name: i.name,
                quantity: i.quantity,
                unit: i.unit,
                emoji: i.emoji,
                // ✅ ARA SÍ: COPIEM EXPLÍCITAMENT ELS CAMPS DE VINCULACIÓ
                linkedProductId: i.linkedProductId,
                linkedProductImage: i.linkedProductImage,
                estimatedCost: i.estimatedCost
            }))
        };
    }
}