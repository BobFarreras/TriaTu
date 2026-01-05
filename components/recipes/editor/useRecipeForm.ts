// src/components/recipes/editor/useRecipeForm.ts
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createRecipeAction } from '@/app/actions/create-recipe';
import { EditorData } from './types';
import { Dictionary } from '@/lib/i18n/dictionaries';

export function useRecipeForm(labels: Dictionary['create_recipe'], setActiveTab: (tab: 'ingredients' | 'steps') => void) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Errors visuals
  const [errors, setErrors] = useState({
    name: false,
    ingredients: false,
    steps: false
  });

  // Dades del formulari
  const [data, setData] = useState<EditorData>({
    name: '',
    prepTimeMinutes: 30,
    ingredients: [],
    steps: [],
    dietaryTags: []
  });

  const handleSave = async () => {
    // 1. Reset Errors
    setErrors({ name: false, ingredients: false, steps: false });
    let hasError = false;

    // 2. Validacions
    if (!data.name.trim()) {
      toast.error("Falta el Títol!", { description: "Posa-li un nom a la teva obra mestra 👨‍🍳" });
      setErrors(prev => ({ ...prev, name: true }));
      hasError = true;
    }
    else if (data.ingredients.length === 0) {
      toast.error("Falten Ingredients!", { description: "No es pot cuinar sense menjar! Afegeix-ne algun." });
      setErrors(prev => ({ ...prev, ingredients: true }));
      setActiveTab('ingredients');
      hasError = true;
    }
    else if (data.steps.length === 0) {
      toast.error("Falten els Passos!", { description: "Explica'ns com es fa la recepta." });
      setErrors(prev => ({ ...prev, steps: true }));
      setActiveTab('steps');
      hasError = true;
    }

    if (hasError) return;

    // 3. Guardar
    setLoading(true);
    const result = await createRecipeAction(data);
    setLoading(false);

    if (result.success) {
      toast.success(labels.toasts.success_title, { description: labels.toasts.success_desc });
      router.push(`/recipes/${result.recipeId}`);
    } else {
      toast.error(labels.toasts.error_title, { description: result.error });
    }
  };

  return {
    data,
    setData,
    loading,
    errors,
    handleSave
  };
}