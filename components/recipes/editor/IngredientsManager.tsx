// src/components/recipes/ingredients/IngredientsManager.tsx
'use client'

import { EditorData, InventoryItemUI } from '../types';
import { useIngredientsManager } from '../ingredients/useIngredientsManager';
import { IngredientActionSheet } from '../ingredients/IngredientActionSheet';
import { SearchHeader, PresetsGrid } from '../ingredients/IngredientTools';
import { IngredientBasket } from '../ingredients/IngredientBasket';
import { IngredientsLabels } from '../types';


interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  inventory: InventoryItemUI[];
  labels: IngredientsLabels; // 👈 Ja no és 'any'
}

export function IngredientsManager({ data, update, inventory, labels }: Props) {
  // ... resta del codi igual
  const {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    activeItem, setActiveItem,
    qty, setQty,
    filteredPresets,
    openSelection,
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

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col h-150">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-2xl">🥕</span> {labels.title}
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {data.ingredients.length} {labels.selected}
            </span>
        </div>

        <SearchHeader 
          query={query} setQuery={setQuery}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          labels={labels}
        />

        <PresetsGrid 
          presets={filteredPresets}
          inventory={inventory}
          onSelect={openSelection}
          emptyLabel={labels.empty_search}
        />

        <IngredientBasket 
          ingredients={data.ingredients}
          onRemove={removeIngredient}
          labels={{ title: labels.basket_title, empty: labels.basket_empty }}
        />
      </div>
    </>
  );
}