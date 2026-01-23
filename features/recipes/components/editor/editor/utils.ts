import { RecipeProps } from '@/core/domain/entities/Recipe';
import { EditorData, EditorIngredient } from '../types';
import { TourStep } from '@/components/onboarding/OnboardingContext';
import { Dictionary } from '@/lib/i18n/dictionaries';

interface ExtendedIngredient {
  name: string;
  quantity: number;
  unit: string;
  emoji?: string;
  image?: string;
  productImage?: string;
  linkedProductImage?: string;
  estimatedCost?: number;
  linkedProductId?: string;
}

export function mapRecipeToFormData(recipe?: RecipeProps): EditorData | undefined {
  if (!recipe) {
    console.log("?? [Editor Mapper] No recipe provided");
    return undefined;
  }

  console.log("?? [Editor Mapper] Ingredients entrant:", recipe.ingredients);
  console.log("?? [Editor Mapper] Steps entrant:", recipe.steps);

  return {
    id: recipe.id,
    name: recipe.name,
    prepTimeMinutes: recipe.prepTimeMinutes,
    dietaryTags: recipe.dietaryTags || [],
    tags: recipe.tags || [],
    description: "",
    servings: 2,
    difficulty: 'medium',
    ingredients: recipe.ingredients.map((ing) => {
      const i = ing as unknown as ExtendedIngredient;
      const foundImage = i.image || i.productImage || i.linkedProductImage || undefined;

      return {
        id: crypto.randomUUID(),
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
        emoji: i.emoji,
        image: foundImage,
        linkedProductImage: foundImage,
        estimatedCost: i.estimatedCost || 0,
        linkedProductId: i.linkedProductId
      };
    }),
    steps: recipe.steps.map((s) => ({
      id: crypto.randomUUID(),
      content: s || ""
    }))
  };
}

export function getEditorTourSteps(t: Dictionary): TourStep[] {
  return [
    { targetId: 'tour-recipe-title', title: t.onboarding.editor.step1_title, description: t.onboarding.editor.step1_desc, requiredTab: 'meta' },
    { targetId: 'tour-prep-time', title: t.onboarding.editor.step2_title, description: t.onboarding.editor.step2_desc, requiredTab: 'meta' },
    { targetId: 'tour-dietary-tags', title: t.onboarding.editor.step3_title, description: t.onboarding.editor.step3_desc, requiredTab: 'meta' },
    { targetId: 'tour-ing-input', title: t.onboarding.editor.step4_title, description: t.onboarding.editor.step4_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-ing-list', title: t.onboarding.editor.step5_title, description: t.onboarding.editor.step5_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-step-textarea', title: t.onboarding.editor.step6_title, description: t.onboarding.editor.step6_desc, requiredTab: 'steps' },
    { targetId: 'tour-step-chips', title: t.onboarding.editor.step7_title, description: t.onboarding.editor.step7_desc, requiredTab: 'steps' },
    { targetId: 'tour-save-btn', title: t.onboarding.editor.step8_title, description: t.onboarding.editor.step8_desc }
  ];
}

export function getEditorTourSamples(): {
  name: string;
  prepTimeMinutes: number;
  dietaryTags: string[];
  ingredients: EditorIngredient[];
  linkedIngredients: EditorIngredient[];
  stepText: string;
} {
  const ingredients: EditorIngredient[] = [
    { id: 'tour-ingredient-1', name: 'Ceba', quantity: 1, unit: 'ut', emoji: '🧅' },
    { id: 'tour-ingredient-2', name: 'Tomàquet', quantity: 2, unit: 'ut', emoji: '🍅' },
    { id: 'tour-ingredient-3', name: 'Oli d\'oliva', quantity: 2, unit: 'cda', emoji: '🫒' }
  ];

  const linkedIngredients: EditorIngredient[] = ingredients.map((ing, index) => ({
    ...ing,
    linkedProductId: `tour-product-${index + 1}`,
    estimatedCost: [0.35, 0.6, 0.25][index] ?? 0.2
  }));

  return {
    name: 'Pizza verda',
    prepTimeMinutes: 30,
    dietaryTags: ['vegan'],
    ingredients,
    linkedIngredients,
    stepText: 'Salteja la ceba, afegeix [Tomàquet] i cuina 10 min.'
  };
}
