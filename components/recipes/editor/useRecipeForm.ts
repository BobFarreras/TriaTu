'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { toast } from 'sonner'; 
import { saveRecipeAction } from '@/app/actions/recipe-actions';
import { EditorData } from './types'; // ✅ Usamos solo el tipo correcto
import { Dictionary } from '@/lib/i18n/dictionaries';

// ✅ 1. AFEGIM EL MAPA DE TRADUCCIÓ (Anglès UI -> Català DB)
const DB_TAGS_MAPPING: Record<string, string> = {
  // Dietes
  'vegan': 'vegà',
  'vegetarian': 'vegetarià',
  'gluten-free': 'sense gluten',
  'dairy-free': 'sense lactosa',
  'healthy': 'sa',

  // Tipus de plat
  'breakfast': 'esmorzar',
  'lunch': 'dinar',
  'dinner': 'sopar',
  'snack': 'snack',
  'dessert': 'postres',

  // Característiques
  'quick': 'ràpid',
  'spicy': 'picant',
  'traditional': 'tradicional',
  'fresh': 'fresc',
  'winter': 'hivern',
  'summer': 'estiu',
  'meat': 'carn',
  'fish': 'peix',
  'pasta': 'pasta',
  'rice': 'arròs'
};

// Definim l'estat del modal
type FeedbackState = {
  isOpen: boolean;
  type: 'error' | 'success';
  title: string;
  message: string;
};

// ✅ Modifiquem la signatura per acceptar 'initialData' (Opcional)
export function useRecipeForm(
    labels: Dictionary['create_recipe'], 
    setActiveTab: (tab: 'ingredients' | 'steps') => void,
    initialData?: EditorData // ✅ Paràmetre nou per a edició
) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ESTAT NOU: Control del Modal
  const [feedback, setFeedback] = useState<FeedbackState>({
    isOpen: false, type: 'error', title: '', message: ''
  });

  // Errors visuals 
  const [errors, setErrors] = useState({
    name: false, ingredients: false, steps: false
  });

  // ✅ INICIALITZACIÓ DE L'ESTAT (Create vs Edit)
  // Si tenim initialData (Edició), l'ussem. Si no, valors per defecte (Creació).
  const [data, setData] = useState<EditorData>(initialData || {
    name: '',
    prepTimeMinutes: 30,
    ingredients: [],
    steps: [],
    dietaryTags: [],
    description: '',
    servings: 2,
    difficulty: 'medium'
  });

  const closeFeedback = () => setFeedback(prev => ({ ...prev, isOpen: false }));

  const handleSave = async () => {
    setErrors({ name: false, ingredients: false, steps: false });

    // VALIDACIONS AMB TRADUCCIÓ DINÀMICA
    if (!data.name.trim()) {
      setErrors(prev => ({ ...prev, name: true }));
      setFeedback({
        isOpen: true, type: 'error',
        title: labels.errors.title_missing,
        message: labels.errors.title_missing_desc
      });
      return;
    }

    if (data.ingredients.length === 0) {
      setErrors(prev => ({ ...prev, ingredients: true }));
      setActiveTab('ingredients');
      setFeedback({
        isOpen: true, type: 'error',
        title: labels.errors.ingredients_missing,
        message: labels.errors.ingredients_missing_desc
      });
      return;
    }

    if (data.steps.length === 0) {
      setErrors(prev => ({ ...prev, steps: true }));
      setActiveTab('steps');
      setFeedback({
        isOpen: true, type: 'error',
        title: labels.errors.steps_missing,
        message: labels.errors.steps_missing_desc
      });
      return;
    }

    // ✅ 2. PREPARAR DADES: TRADUCCIÓ DE TAGS
    const translatedTags = data.dietaryTags.map(tag => DB_TAGS_MAPPING[tag] || tag);

    const payload: EditorData = {
      ...data,
      dietaryTags: translatedTags
    };

    setLoading(true);
    
    // ✅ CRIDA A LA NOVA ACCIÓ CENTRALITZADA
    // Si estem editant, assegura't que l'acció (saveRecipeAction) gestioni l'Update si rep un ID,
    // o crea una updateRecipeAction separada. Per ara mantenim la lògica original.
    const result = await saveRecipeAction(payload);
    
    setLoading(false);

    if (result.success) {
      router.push(`/recipes/${result.recipeId}`);
    } else {
      setFeedback({
        isOpen: true, type: 'error',
        title: labels.toasts.error_title,
        message: result.error || "Hi ha hagut un error inesperat."
      });
    }
  };

  return {
    data, setData, loading, errors, handleSave,
    feedback, closeFeedback 
  };
}