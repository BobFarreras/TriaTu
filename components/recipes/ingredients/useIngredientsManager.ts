// src/components/recipes/ingredients/useIngredientsManager.ts
import { useState, useMemo } from 'react';
// ✅ FEM SERVIR 'Ingredient' EXPLICITAMENT ABAIX
import { EditorData, Ingredient } from '../editor/types';
import { FOOD_PRESETS, FoodCategory } from "@/lib/food-presets";

export function useIngredientsManager(data: EditorData, update: (d: EditorData) => void) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  
  const [activeItem, setActiveItem] = useState<{name: string, emoji: string, unit: string} | null>(null);
  const [qty, setQty] = useState(1);

  const filteredPresets = useMemo(() => {
    return FOOD_PRESETS.filter(preset => {
      const matchesSearch = preset.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || preset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [query, selectedCategory]);

  const getIncrementStep = (unit: string) => {
    switch (unit) {
      case 'g': return 100;
      case 'ml': return 100;
      case 'kg': return 0.5;
      case 'l': return 0.5;
      default: return 1;
    }
  };

  const quickAdd = (preset: typeof FOOD_PRESETS[0]) => {
    const existingIndex = data.ingredients.findIndex(i => i.name === preset.name);
    const step = getIncrementStep(preset.defaultUnit);
    
    // ✅ CORRECCIÓ 1: 'const' en lloc de 'let'.
    // ✅ CORRECCIÓ 2: Tipatge explícit ': Ingredient[]' per usar l'import.
    const newIngredients: Ingredient[] = [...data.ingredients];

    if (existingIndex >= 0) {
      const current = newIngredients[existingIndex];
      newIngredients[existingIndex] = {
        ...current,
        quantity: current.quantity + step
      };
    } else {
      newIngredients.push({
        name: preset.name,
        quantity: step,
        unit: preset.defaultUnit
      });
    }

    update({ ...data, ingredients: newIngredients });
    
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
    }
  };

  const removeIngredient = (index: number) => {
    update({
      ...data,
      ingredients: data.ingredients.filter((_, i) => i !== index)
    });
  };

  const openSelection = (preset: typeof FOOD_PRESETS[0]) => {
    setActiveItem({ name: preset.name, emoji: preset.emoji, unit: preset.defaultUnit });
    setQty(1);
  };

  const closeSelection = () => {
    setActiveItem(null);
    setQty(1);
  };

  const confirmAdd = () => {
    if (!activeItem) return;
    
    const existingIndex = data.ingredients.findIndex(i => i.name === activeItem.name);
    // ✅ CORRECCIÓ: Aquí també 'const' i tipatge
    const newIngredients: Ingredient[] = [...data.ingredients];
    
    if (existingIndex >= 0) {
       // Si ja existeix, sumem la quantitat del modal a l'existent
       const current = newIngredients[existingIndex];
       newIngredients[existingIndex] = {
         ...current,
         quantity: current.quantity + qty,
         unit: activeItem.unit // Actualitzem la unitat a la nova seleccionada
       };
    } else {
       newIngredients.push({ 
         name: activeItem.name, 
         quantity: qty, 
         unit: activeItem.unit 
       });
    }
    
    update({ ...data, ingredients: newIngredients });
    closeSelection();
  };

  return {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    activeItem, setActiveItem,
    qty, setQty,
    filteredPresets,
    quickAdd,
    openSelection,
    closeSelection,
    confirmAdd,
    removeIngredient
  };
}