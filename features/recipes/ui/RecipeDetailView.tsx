// src/features/recipes/ui/RecipeDetailView.tsx
'use client';

import Link from 'next/link';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { RecipeHeader, getEmoji } from './components/RecipeHeader';
import { IngredientsPanel, IngredientWithMeta } from './components/IngredientsPanel';
import { StepsPanel } from './components/StepsPanel';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/ui/BackButton';
import { Clock, Euro, Edit } from 'lucide-react';
import { FavoriteButton } from '@/components/recipes/FavoriteButton';

// Utilitzem un tipus compatible amb el que espera el Panel
interface Props {
  recipe: RecipeProps;
  inventory: InventoryItemProps[];
  userId: string;
}

export function RecipeDetailView({ recipe, inventory, userId }: Props) {
  // Casting segur per accedir a les metadades
  const extendedRecipe = recipe as unknown as { 
      ingredients: IngredientWithMeta[], 
      estimatedCost?: number,
      authorName?: string 
  };
  
  const cost = extendedRecipe.estimatedCost || 0;
  const emoji = getEmoji(recipe.name);
  const isAuthor = recipe.authorId === userId;

  // 🔍 DEBUG: Això ens dirà si les dades arriben bé del servidor
  console.group("🔍 [RecipeDetailView] Debug");
  console.log("Recepta:", recipe.name);
  console.log("Ingredients (Raw):", extendedRecipe.ingredients);
  extendedRecipe.ingredients.forEach((ing, i) => {
      if (ing.linkedProductImage) {
          console.log(`✅ Ingredient ${i} (${ing.name}) té IMATGE VINCULADA:`, ing.linkedProductImage);
      } else if (ing.image) {
          console.log(`ℹ️ Ingredient ${i} (${ing.name}) té imatge genèrica:`, ing.image);
      } else {
          console.log(`⚠️ Ingredient ${i} (${ing.name}) NO té imatge.`);
      }
  });
  console.groupEnd();

  return (
    <div className="flex flex-col gap-6">
      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-3 shadow-xl">
        <div className="flex items-center gap-3">
            <div className="shrink-0">
                <BackButton href="/recipes" className="bg-slate-800 text-white p-2 rounded-full" label="" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center mr-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl leading-none">{emoji}</span>
                    <h1 className="text-sm font-black text-white truncate leading-tight">{recipe.name}</h1>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                    {recipe.prepTimeMinutes > 0 && (
                        <span className="flex items-center gap-1"><Clock size={10} /> {recipe.prepTimeMinutes}m</span>
                    )}
                    {cost > 0 && (
                        <span className="flex items-center gap-1 text-emerald-400"><Euro size={10} /> {cost.toFixed(2)}€</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <FavoriteButton 
                    recipeId={recipe.id} 
                    initialIsFavorite={!!recipe.isFavorite}
                    className="w-8 h-8 bg-slate-800 border border-slate-700" 
                />
                {isAuthor && (
                    <Link 
                        href={`/recipes/${recipe.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-colors"
                    >
                        <Edit size={14} />
                    </Link>
                )}
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
          {/* --- DESKTOP HEADER --- */}
          <div className="hidden lg:flex items-start gap-4 mb-8 relative pt-6">
             <div className="shrink-0 flex flex-col gap-3 sticky top-8 z-10">
                <BackButton href="/recipes" label="Tornar" className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all" />
                <div className="flex items-center gap-2 mt-2">
                    <FavoriteButton 
                        recipeId={recipe.id} 
                        initialIsFavorite={!!recipe.isFavorite}
                        className="w-10 h-10 bg-slate-900 border border-slate-700 hover:border-rose-500/50"
                    />
                    {isAuthor && (
                        <Link href={`/recipes/${recipe.id}/edit`} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-purple-600 hover:text-white transition-all border border-slate-700 hover:border-purple-500" title="Editar Recepta">
                            <Edit size={18} />
                        </Link>
                    )}
                </div>
             </div>

             <motion.div className="flex-1 ml-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <RecipeHeader
                  name={recipe.name}
                  prepTime={recipe.prepTimeMinutes}
                  tags={recipe.tags}
                  estimatedCost={cost}
                  authorName={extendedRecipe.authorName || "Xef Anònim"}
                />
             </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pb-20">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-4 lg:sticky lg:top-8 z-40">
              <IngredientsPanel
                ingredients={extendedRecipe.ingredients}
                inventory={inventory}
                userId={userId}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-8">
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