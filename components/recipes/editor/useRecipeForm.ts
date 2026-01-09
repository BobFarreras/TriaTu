'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { toast } from 'sonner'; 
import { createRecipeAction } from '@/app/actions/create-recipe';
import { EditorData } from './types';
import { Dictionary } from '@/lib/i18n/dictionaries';

// ✅ 1. AFEGIM EL MAPA DE TRADUCCIÓ (Anglès UI -> Català DB)
// Això assegura que a la DB es guardin en l'idioma que els filtres esperen.
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

export function useRecipeForm(labels: Dictionary['create_recipe'], setActiveTab: (tab: 'ingredients' | 'steps') => void) {
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

  const [data, setData] = useState<EditorData>({
    name: '', prepTimeMinutes: 30, ingredients: [], steps: [], dietaryTags: []
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
    // Abans d'enviar, canviem els tags d'Anglès (UI) a Català (DB)
    const translatedTags = data.dietaryTags.map(tag => DB_TAGS_MAPPING[tag] || tag);

    // Creem un objecte nou amb els tags traduïts
    const payload = {
      ...data,
      dietaryTags: translatedTags
    };

    // GUARDAR AL SERVIDOR
    setLoading(true);
    // ✅ Enviem el payload traduït en lloc de 'data' directament
    const result = await createRecipeAction(payload);
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