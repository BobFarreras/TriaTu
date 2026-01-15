'use client';

import { RecipeProps } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { RecipeHeader, getEmoji } from './components/RecipeHeader';
import { IngredientsPanel, IngredientWithMeta } from './components/IngredientsPanel';
import { StepsPanel } from './components/StepsPanel';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/ui/BackButton'; // Assegura't de tenir aquest component
import { Clock, Euro } from 'lucide-react';

interface ExtendedRecipeProps extends Omit<RecipeProps, 'ingredients'> {
  ingredients: IngredientWithMeta[];
  estimatedCost?: number;
  authorName?: string;
}

interface Props {
  recipe: RecipeProps;
  inventory: InventoryItemProps[];
  userId: string;
}

export function RecipeDetailView({ recipe, inventory, userId }: Props) {
  const extendedRecipe = recipe as unknown as ExtendedRecipeProps;
  const cost = extendedRecipe.estimatedCost || 0;
  // ✅ Calculem l'emoji aquí per fer-lo servir al mòbil
  const emoji = getEmoji(recipe.name);
  return (
    <div className="flex flex-col gap-6">

     {/* --- 📱 MOBILE STICKY HEADER --- */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-3 shadow-xl">
        <div className="flex items-center gap-3">
            <div className="shrink-0">
                <BackButton href="/recipes" className="bg-slate-800 text-white p-2 rounded-full" label="" />
            </div>
            
            {/* ✅ EMOJI AL MÒBIL */}
            <div className="text-2xl shrink-0 leading-none pb-1">
                {emoji}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h1 className="text-base font-black text-white truncate leading-tight">
                    {recipe.name}
                </h1>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                    {recipe.prepTimeMinutes > 0 && (
                        <span className="flex items-center gap-1"><Clock size={10} /> {recipe.prepTimeMinutes}m</span>
                    )}
                    {cost > 0 && (
                        <span className="flex items-center gap-1 text-emerald-400"><Euro size={10} /> {cost.toFixed(2)}€</span>
                        
                    
                    )}
                   
                </div>
            </div>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="container mx-auto px-4 max-w-6xl">

          {/* --- 💻 DESKTOP HEADER (Flex Row ara) --- */}
          <div className="hidden lg:flex items-start gap-4 mb-8 relative">
             {/* BOTÓ ENRERE A L'ESQUERRA */}
             <div className="shrink-0 mt-4 z-10">
                <BackButton 
                    href="/recipes" 
                    label="Tornar" 
                    className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all" 
                />
             </div>

             {/* HEADER CENTRAL */}
             <motion.div 
                className="flex-1"
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
             >
                <RecipeHeader
                  name={recipe.name}
                  prepTime={recipe.prepTimeMinutes}
                  tags={recipe.tags}
                  estimatedCost={cost}
                  authorName={extendedRecipe.authorName || "Xef Anònim"}
                />
             </motion.div>
          </div>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
  
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 lg:sticky lg:top-8 z-40"
            >
              <IngredientsPanel
                ingredients={extendedRecipe.ingredients}
                inventory={inventory}
                userId={userId}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-8"
            >
              <StepsPanel
                steps={recipe.steps}
                ingredients={extendedRecipe.ingredients}
              />
            </motion.div>

          </div>
      </div>
    </div>
  );
}