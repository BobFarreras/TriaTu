import { useState, useMemo } from 'react';
import { EditorData, Ingredient, FoodPreset } from '../editor/types';
import { FOOD_PRESETS } from "@/lib/food-presets";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { filterAndOrderPresets } from './presetFilter';

export function useIngredientsManager(data: EditorData, update: (d: EditorData) => void) {
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');
  
  const [activeItem, setActiveItem] = useState<{name: string, emoji: string, unit: string} | null>(null);
  const [qty, setQty] = useState(1);

  // 1. TRADUCCIÓ
  const translatedPresets = useMemo<FoodPreset[]>(() => {
    return FOOD_PRESETS.map(preset => {
      const itemTranslations = t.food?.items as Record<string, string> | undefined;
      const translatedName = itemTranslations?.[preset.id] || preset.name;

      const catTranslations = t.food?.categories as Record<string, string> | undefined;
      const translatedCategory = catTranslations?.[preset.category] || preset.category;

      return {
        ...preset,
        name: translatedName,
        category: translatedCategory, 
        defaultUnit: preset.defaultUnit as string,
        step: preset.step || 1 
      };
    });
  }, [t]);

  // 2. FILTRATGE
  const filteredPresets = useMemo(() => {
    return filterAndOrderPresets(translatedPresets, query, selectedCategory);
  }, [query, selectedCategory, translatedPresets]);

  const getIncrementStep = (unit: string) => {
    switch (unit) {
      case 'g': return 100;
      case 'ml': return 100;
      case 'kg': return 0.5;
      case 'l': return 0.5;
      default: return 1;
    }
  };

  const quickAdd = (preset: FoodPreset) => {
    const existingIndex = data.ingredients.findIndex(i => i.name === preset.name);
    const step = getIncrementStep(preset.defaultUnit);
    const newIngredients: Ingredient[] = [...data.ingredients];

    if (existingIndex >= 0) {
      const current = newIngredients[existingIndex];
      newIngredients[existingIndex] = {
        ...current,
        quantity: current.quantity + step
      };
    } else {
      newIngredients.push({
        id: crypto.randomUUID(),
        name: preset.name,
        quantity: step,
        unit: preset.defaultUnit,
        emoji: preset.emoji 
      });
    }

    update({ ...data, ingredients: newIngredients });
    
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
    }
  };

  // ✅ CORRECCIÓ CLAU: Ara acceptem 'id' (string) en lloc de 'index' (number)
  const removeIngredient = (id: string) => {
    update({
      ...data,
      ingredients: data.ingredients.filter((item) => item.id !== id)
    });
  };

  const openSelection = (preset: FoodPreset) => {
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
    const newIngredients: Ingredient[] = [...data.ingredients];
    
    if (existingIndex >= 0) {
       const current = newIngredients[existingIndex];
       newIngredients[existingIndex] = {
         ...current,
         quantity: current.quantity + qty,
         unit: activeItem.unit 
       };
    } else {
       newIngredients.push({ 
         id: crypto.randomUUID(),
         name: activeItem.name, 
         quantity: qty, 
         unit: activeItem.unit,
         emoji: activeItem.emoji
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
    removeIngredient // ✅ Ara ja és compatible amb (id: string)
  };
}
