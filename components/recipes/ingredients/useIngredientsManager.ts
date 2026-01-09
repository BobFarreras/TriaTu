import { useState, useMemo } from 'react';
// ✅ CANVI 1: Importem TOTS els tipus de la UI, no de la llibreria
import { EditorData, Ingredient, FoodPreset } from '../editor/types';
import { FOOD_PRESETS } from "@/lib/food-presets";
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function useIngredientsManager(data: EditorData, update: (d: EditorData) => void) {
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  // ✅ CANVI 2: 'selectedCategory' ara és string (perquè pot ser "🥦 Verdura")
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');
  
  const [activeItem, setActiveItem] = useState<{name: string, emoji: string, unit: string} | null>(null);
  const [qty, setQty] = useState(1);

  // 1. TRADUCCIÓ
  // ✅ CANVI 3: Tipem explícitament el retorn com a FoodPreset[] (el de la UI)
  const translatedPresets = useMemo<FoodPreset[]>(() => {
    return FOOD_PRESETS.map(preset => {
      // Cast segur per accedir al diccionari
      const itemTranslations = t.food?.items as Record<string, string> | undefined;
      const translatedName = itemTranslations?.[preset.id] || preset.name;

      const catTranslations = t.food?.categories as Record<string, string> | undefined;
      const translatedCategory = catTranslations?.[preset.category] || preset.category;

      return {
        ...preset,
        name: translatedName,
        category: translatedCategory, 
        // TypeScript es queixava de defaultUnit, ens assegurem que sigui string
        defaultUnit: preset.defaultUnit as string,
        // Afegim step si no hi és (encara que a food-presets n'hi hauria d'haver)
        step: preset.step || 1 
      };
    });
  }, [t]);

  // 2. FILTRATGE
  const filteredPresets = useMemo(() => {
    return translatedPresets.filter(preset => {
      const matchesSearch = preset.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || preset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
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

  // ✅ CANVI 4: La funció accepta el FoodPreset de la UI (traduït)
  // Ja no fem servir 'typeof FOOD_PRESETS[0]' perquè això forçava el tipus estricte
  const quickAdd = (preset: FoodPreset) => {
    const existingIndex = data.ingredients.findIndex(i => i.name === preset.name);
    
    // Si la unitat ve com a string genèric, el switch funciona igual
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

  const removeIngredient = (index: number) => {
    update({
      ...data,
      ingredients: data.ingredients.filter((_, i) => i !== index)
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
    removeIngredient
  };
}