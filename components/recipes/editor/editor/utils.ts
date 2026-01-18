import { RecipeProps } from '@/core/domain/entities/Recipe';
import { EditorData } from '../types';
import { TourStep } from '@/components/onboarding/OnboardingContext';
import { Dictionary } from '@/lib/i18n/dictionaries'; // ✅ 1. Importem el tipus del diccionari

// Definim una interfície local per accedir a propietats extres que venen de la BD
// però potser no estan estrictes a RecipeProps base
// Interfície per llegir el que ve del Repositori/Domini
interface ExtendedIngredient {
  name: string;
  quantity: number;
  unit: string;
  emoji?: string;
  // Totes les opcions possibles on pot haver-hi la foto
  image?: string;
  productImage?: string;
  linkedProductImage?: string;
  estimatedCost?: number;
  linkedProductId?: string;
}

export function mapRecipeToFormData(recipe?: RecipeProps): EditorData | undefined {
  if (!recipe) {
    console.log("⚠️ [Editor Mapper] No recipe provided");
    return undefined;
  }

  // ✅ DEBUG: Veure què estem rebent realment del domini
  console.log("🔍 [Editor Mapper] Ingredients entrant:", recipe.ingredients);
  console.log("🔍 [Editor Mapper] Steps entrant:", recipe.steps);

  return {
    id: recipe.id,
    name: recipe.name,
    prepTimeMinutes: recipe.prepTimeMinutes,
    dietaryTags: recipe.dietaryTags || [],

    // ✅ SOLUCIÓ: Afegim el camp 'tags' que demana EditorData
    // El traiem directament de recipe.tags o un array buit si no existís
    tags: recipe.tags || [],

    description: "",
    servings: 2,
    difficulty: 'medium',

    // 1. INGREDIENTS AMB FOTOS I PREUS
    ingredients: recipe.ingredients.map(ing => {
      const i = ing as unknown as ExtendedIngredient;

      // Busquem la imatge a qualsevol lloc possible
      const foundImage = i.image || i.productImage || i.linkedProductImage || undefined;

      return {
        id: crypto.randomUUID(),
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
        emoji: i.emoji,

        // ✅ MAPPEIG ROBUST PER VISUALITZACIÓ
        image: foundImage, // Això és el que busca l'IngredientChip
        linkedProductImage: foundImage, // Per si de cas
        estimatedCost: i.estimatedCost || 0,
        linkedProductId: i.linkedProductId
      };
    }),

    // 2. PASSOS (Com que hem arreglat el Repositori, això ara funcionarà bé)
    steps: recipe.steps.map(s => ({
      id: crypto.randomUUID(),
      content: s || "" // 's' ara serà un string net gràcies a la Solució 1
    }))
  };
}

// ✅ Configuració del Tour (Sense 'any')
// Ara 't' utilitza el tipus Dictionary correcte
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