// src/components/recipes/ingredients/useIngredientsManager.ts
import { useState, useMemo } from 'react';
import { EditorData } from '../types';
import { FOOD_PRESETS, FoodCategory } from "@/lib/food-presets";

export function useIngredientsManager(data: EditorData, update: (d: EditorData) => void) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  
  // Estat del Modal / Selecció activa
  const [activeItem, setActiveItem] = useState<{name: string, emoji: string, unit: string} | null>(null);
  const [qty, setQty] = useState(1);

  // Lògica de filtratge
  const filteredPresets = useMemo(() => {
    return FOOD_PRESETS.filter(preset => {
      const matchesSearch = preset.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || preset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [query, selectedCategory]);

  // Accions
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
    update({
      ...data,
      ingredients: [...data.ingredients, { name: activeItem.name, quantity: qty, unit: activeItem.unit }]
    });
    closeSelection();
    setQuery('');
  };

  const removeIngredient = (index: number) => {
    update({
      ...data,
      ingredients: data.ingredients.filter((_, i) => i !== index)
    });
  };

  return {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    activeItem, setActiveItem,
    qty, setQty,
    filteredPresets,
    openSelection,
    closeSelection,
    confirmAdd,
    removeIngredient
  };
}