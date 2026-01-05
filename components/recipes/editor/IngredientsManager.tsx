// src/components/recipes/editor/IngredientsManager.tsx
'use client'

import { EditorData, InventoryItemUI, IngredientsLabels } from './types';
import { useIngredientsManager } from '../ingredients/useIngredientsManager';
import { IngredientActionSheet } from '../ingredients/IngredientActionSheet';
import { SearchHeader, CalculatorGrid } from '../ingredients/IngredientTools';
import { IngredientDock } from '../ingredients/IngredientDock';

interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  inventory: InventoryItemUI[];
  labels: IngredientsLabels;
}

export function IngredientsManager({ data, update, inventory, labels }: Props) {
  const {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    activeItem, setActiveItem,
    qty, setQty,
    filteredPresets,
    quickAdd,
    closeSelection,
    confirmAdd,
    removeIngredient
  } = useIngredientsManager(data, update);

  return (
    <>
      <IngredientActionSheet 
        activeItem={activeItem}
        qty={qty}
        setQty={setQty}
        updateItemUnit={(u) => activeItem && setActiveItem({ ...activeItem, unit: u })}
        onClose={closeSelection}
        onConfirm={confirmAdd}
      />

      {/* h-full és crucial aquí perquè els fills s'expandeixin */}
      <div className="flex flex-col h-full w-full relative overflow-hidden">
        
        {/* Header (Sense fons opac, deixem que passi el blur del pare) */}
        <div className="shrink-0">
            <SearchHeader 
            query={query} setQuery={setQuery}
            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            labels={labels}
            />
        </div>

        {/* Grid (flex-1 per ocupar la resta de l'espai) */}
        <div className="flex-1 overflow-hidden relative">
            <CalculatorGrid 
            presets={filteredPresets}
            inventory={inventory}
            currentIngredients={data.ingredients}
            onQuickAdd={quickAdd}
            emptyLabel={labels.empty_search}
            />
        </div>

        {/* Dock (Flotant a baix) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
             <div className="pointer-events-auto">
                <IngredientDock 
                    ingredients={data.ingredients}
                    onRemove={removeIngredient}
                    labels={{ title: labels.basket_title, empty: labels.basket_empty }}
                />
             </div>
        </div>
      </div>
    </>
  );
}