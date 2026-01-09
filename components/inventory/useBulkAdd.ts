'use client'

import { useState } from 'react';
import { toast } from 'sonner';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { addBatchItemsAction } from '@/app/actions/inventory';
import { InventoryItemUI, FoodCategory, FoodPreset } from '../recipes/editor/types';

// ✅ IMPORTEM DIRECTAMENT LES DADES DEL TEU ARXIU
import { FOOD_PRESETS } from '@/lib/food-presets';

export interface PendingInventoryItem extends InventoryItemUI {
  location: StorageLocation;
  emoji: string;
}

export function useBulkAdd(onSuccess: () => void) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  
  const [basket, setBasket] = useState<PendingInventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ QUICK ADD (Simplificat)
  const quickAdd = (preset: FoodPreset) => {
    setBasket(prevBasket => {
      // Busquem si ja tenim aquest producte a la cistella pel nom
      const existingIndex = prevBasket.findIndex(i => i.name === preset.name);

      if (existingIndex >= 0) {
        // SI EXISTEIX -> SUMEM +1
        const updated = [...prevBasket];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        // SI NO EXISTEIX -> AFEGIM NOU
        const newItem: PendingInventoryItem = {
            id: crypto.randomUUID(),
            name: preset.name,
            emoji: preset.emoji,
            quantity: 1, 
            unit: preset.defaultUnit,
            location: preset.defaultLoc || StorageLocation.PANTRY,
            expiryDate: undefined
        };
        return [...prevBasket, newItem];
      }
    });
  };

  const removeIngredientByIndex = (index: number) => {
    setBasket(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (basket.length === 0) return;
    setLoading(true);

    const itemsToSave = basket.map(i => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      location: i.location,
      emoji: i.emoji,
      expiryDate: undefined
    }));

    const result = await addBatchItemsAction(itemsToSave);
    setLoading(false);

    if (result.success) {
      toast.success("Inventari actualitzat!");
      setBasket([]);
      onSuccess();
    } else {
      toast.error("Error al guardar", { description: result.error });
    }
  };

  // ✅ FILTRATGE DIRECTE (Sense mappings)
  // Ara 'p.category' és "🥦 Verdura" i 'selectedCategory' també serà "🥦 Verdura"
  const filteredPresets = (FOOD_PRESETS as unknown as FoodPreset[]).filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    basket,
    filteredPresets,
    quickAdd,
    removeIngredientByIndex, 
    handleSave,
    loading
  };
}