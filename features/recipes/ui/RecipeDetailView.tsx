'use client';

import { RecipeProps } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';

// Imports dels components
import { RecipeHeader } from './components/RecipeHeader';
import { IngredientsPanel } from './components/IngredientsPanel';
import { StepsPanel } from './components/StepsPanel';

interface Props {
  recipe: RecipeProps;
  inventory: InventoryItemProps[];
  userId: string;
}

export function RecipeDetailView({ recipe, inventory, userId }: Props) {
  // Nota: Ja no necessitem 'handleCook' aquí perquè la IngredientsPanel
  // gestiona la resta d'estoc automàticament ingredient per ingredient.

  return (
    <div className="w-full max-w-5xl mx-auto pb-10">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
        
        {/* 1. HEADER */}
        <div className="shrink-0">
            <RecipeHeader 
                name={recipe.name} 
                prepTime={recipe.prepTimeMinutes} 
                tags={recipe.tags} 
            />
        </div>

        {/* 2. BODY */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0">
            
            {/* COLUMNA ESQUERRA: INGREDIENTS (Ara passem userId) */}
            <div className="md:col-span-5 lg:col-span-4 h-full min-h-0">
                <IngredientsPanel 
                    ingredients={recipe.ingredients} 
                    inventory={inventory} 
                    userId={userId} // ✅ CORRECCIÓ: Passem el userId
                />
            </div>

            {/* COLUMNA DRETA: PASSOS */}
            <div className="md:col-span-7 lg:col-span-8 h-full min-h-0 bg-slate-950/30">
                <StepsPanel steps={recipe.steps} />
            </div>

        </div>
      </div>
    </div>
  );
}