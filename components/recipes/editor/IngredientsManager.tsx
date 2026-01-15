'use client';

import { useState } from 'react';
import { Ingredient } from './types';
import { EditorData, InventoryItemUI, IngredientsLabels } from './types';
import { useIngredientsManager } from '../ingredients/useIngredientsManager';
import { IngredientActionSheet } from '../ingredients/IngredientActionSheet';
import { SearchHeader, CalculatorGrid } from '../ingredients/IngredientTools';
import { IngredientDock } from '../ingredients/IngredientDock'; // El Dock nou (que espera ID)
import { ProductLinkerModal } from './ingredients/ProductLinkerModal'; // El Modal nou

interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  inventory: InventoryItemUI[];
  labels: IngredientsLabels;
  // ✅ Props per al Tour
  searchInputId?: string;
  ingredientsListId?: string;
}

export function IngredientsManager({
  data, update, inventory, labels,
  searchInputId, ingredientsListId
}: Props) {
  // 1. Hook de gestió (Assegura't d'haver aplicat el canvi a 'removeIngredient' a dalt!)
  const {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    activeItem, setActiveItem,
    qty, setQty,
    filteredPresets,
    quickAdd,
    closeSelection,
    confirmAdd,
    removeIngredient // Aquest ara ha de ser (id: string) => void
  } = useIngredientsManager(data, update);

  // 2. Estat per al Modal Màgic
  const [isLinkerOpen, setIsLinkerOpen] = useState(false);

  // 3. Funció per quan el Modal retorna els ingredients amb preus
  const handleUpdateIngredients = (updated: Ingredient[]) => {
    update({ ...data, ingredients: updated });
  };
  const recipeTotalCost = data.ingredients.reduce((acc, ing) => acc + (ing.estimatedCost || 0), 0);
  return (
    <>
      {/* Selector de Quantitat (quan cliques un preset) */}
      <IngredientActionSheet
        activeItem={activeItem}
        qty={qty}
        setQty={setQty}
        updateItemUnit={(u) => activeItem && setActiveItem({ ...activeItem, unit: u })}
        onClose={closeSelection}
        onConfirm={confirmAdd}
      />

      {/* ✅ EL NOU MODAL MÀGIC */}
      <ProductLinkerModal
        isOpen={isLinkerOpen}
        onClose={() => setIsLinkerOpen(false)}
        ingredients={data.ingredients}
        onUpdateIngredients={handleUpdateIngredients}
      />

      <div className="flex flex-col h-full w-full relative overflow-hidden bg-slate-950">

        {/* FILTRES I CERCA (Lògica antiga que t'agrada) */}
        <div id={searchInputId} className="shrink-0 z-10 bg-slate-900 border-b border-slate-800">
          <SearchHeader
            query={query}
            setQuery={setQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            labels={labels}
            categories={Array.from(new Set(filteredPresets.map(p => p.category)))}
          />
        </div>

        {/* GRAELLA DE PRESETS (Lògica antiga) */}
        <div className="flex-1 overflow-hidden relative">
          <CalculatorGrid
            presets={filteredPresets}
            inventory={inventory}
            currentIngredients={data.ingredients}
            onQuickAdd={quickAdd}
            emptyLabel={labels.empty_search}
          />
        </div>

        {/* DOCK INFERIOR (Nou disseny + Botó Màgic) */}
        <div id={ingredientsListId} className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
          <div className="pointer-events-auto relative">

            {/* 🏷️ ETIQUETA DE PREU TOTAL (Si n'hi ha) */}
            {recipeTotalCost > 0 && (
              <div className="absolute right-4 -top-19 bg-slate-900/90 backdrop-blur border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-xl shadow-xl flex flex-col items-end z-40 animate-in slide-in-from-bottom-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Recepta</span>
                <span className="text-xl font-black font-mono leading-none">{recipeTotalCost.toFixed(2)}€</span>
              </div>
            )}

            <IngredientDock
              ingredients={data.ingredients}
              onRemove={removeIngredient}
              labels={{ title: labels.basket_title, empty: labels.basket_empty }}
              onOpenLinker={() => setIsLinkerOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}