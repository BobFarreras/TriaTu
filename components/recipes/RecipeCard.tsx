'use client'

import { useState } from 'react';
import Link from 'next/link';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { motion, AnimatePresence } from 'framer-motion';
import { StarRating } from './StarRating';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getIngredientEmoji, getMainEmoji } from '@/lib/utils/emojiUtils';
import { Clock, User, Coins, ChefHat, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton'; // ✅ Import correcte

interface Props {
  recipe: RecipeProps;
  userId?: string;
  userRating: number;
}

export function RecipeCard({ recipe, userId, userRating }: Props) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const labels = t.create_recipe.card as {
    view_sr: string;
    prep_time: string;
    created_by_you: string;
    created_by_community: string;
  };

  const recipeWithTags = recipe as RecipeProps & { tags?: string[] | unknown };
  const safeTags: string[] = Array.isArray(recipeWithTags.tags) ? recipeWithTags.tags as string[] : [];
  const mainEmoji = getMainEmoji(recipe.name, safeTags);
  const isAuthor = recipe.authorId === userId;
  
  // Lògica visual de l'autor
  const isAi = recipe.isAiGenerated;
  const displayAuthorName = isAi ? "Chef IA" : (isAuthor ? labels.created_by_you : (recipe.authorName || labels.created_by_community));

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        group relative flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all 
        ${isExpanded ? 'ring-1 ring-purple-500/30 bg-slate-900' : 'hover:border-purple-500/40'}
        h-fit md:h-full
      `}
    >
      {/* ⚠️ LINK GLOBAL (Fons) - Z-INDEX 0 */}
      <Link href={`/recipes/${recipe.id}`} className="absolute inset-0 z-0" prefetch={false}>
        <span className="sr-only">{labels.view_sr} {recipe.name}</span>
      </Link>

      {/* --- CAPÇALERA --- */}
      {/* Nota: 'pointer-events-none' al contenidor, però 'pointer-events-auto' als botons si calgués, 
          però com que Link està a z-0 i els botons tindran z-20, no cal. */}
      <div className="relative p-4 flex gap-4 items-center bg-linear-to-br from-slate-800/50 to-slate-900 border-b border-slate-800/50 z-10 pointer-events-none">
        
        <div className="shrink-0 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-slate-700/50">
            {mainEmoji}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h2 className="text-base font-bold text-slate-100 leading-tight line-clamp-2 pr-12 md:pr-8">
                {recipe.name}
            </h2>
            {recipe.estimatedCost && recipe.estimatedCost > 0 ? (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold mt-1">
                    <Coins size={10} className="stroke-[2.5]" />
                    {recipe.estimatedCost.toFixed(2)}€
                </div>
            ) : <div className="text-xs text-slate-600 mt-1 font-mono">-- €</div>}
        </div>

        {/* ✅ BOTONS INTERACTIUS (Pointer Events Auto + Z-Index Alt) */}
        
        {/* Favorit */}
        <div className="absolute top-3 right-12 md:right-3 z-30 pointer-events-auto">
             <FavoriteButton 
                recipeId={recipe.id} 
                initialIsFavorite={!!recipe.isFavorite} // !! per assegurar boolean
             />
        </div>

        {/* Toggle (Només mòbil) */}
        <button 
            onClick={toggleExpand}
            className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 z-30 pointer-events-auto"
        >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* --- COS RESPONSIVE (Z-INDEX 10 PER ESTAR SOBRE EL LINK) --- */}
      
      {/* 1. VERSIÓ MÒBIL (Desplegable) */}
      <div className="md:hidden relative z-10 pointer-events-none">
          <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-950/30"
                >
                    {/* Reactivamos pointer-events per si hi ha links a dins */}
                    <div className="pointer-events-auto">
                        <CardContent 
                            recipe={recipe} 
                            isAuthor={isAuthor} 
                            isAi={isAi ?? false} 
                            displayAuthorName={displayAuthorName} 
                            userRating={userRating} 
                        />
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* 2. VERSIÓ DESKTOP (Fixa) */}
      <div className="hidden md:flex flex-col flex-1 bg-slate-950/30 relative z-10 pointer-events-none">
          {/* El contingut no sol tenir links, així que pointer-events-none permet que el click traspassi al Link de fons.
              Si CardContent tingués botons, hauries de posar pointer-events-auto allà. */}
          <CardContent 
            recipe={recipe} 
            isAuthor={isAuthor} 
            isAi={isAi ?? false} 
            displayAuthorName={displayAuthorName} 
            userRating={userRating} 
          />
      </div>

    </motion.article>
  );
}

// --- SUBCOMPONENT ---
function CardContent({ recipe, isAuthor, isAi, displayAuthorName, userRating }: { 
    recipe: RecipeProps, isAuthor: boolean, isAi: boolean, displayAuthorName: string, userRating: number 
}) {
    return (
        <div className="flex flex-col h-full">
            {/* INGREDIENTS */}
            <div className="p-4 flex flex-col gap-3 flex-1 relative z-10">
                <div className="flex flex-wrap gap-2 content-start">
                    {recipe.ingredients.slice(0, 4).map((ing, i) => {
                        const hasStoredEmoji = ing.emoji && ing.emoji !== '📦';
                        const displayEmoji = hasStoredEmoji ? ing.emoji : getIngredientEmoji(ing.name);
                        return (
                            <span key={i} className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-950 text-slate-300 px-2 py-1 rounded border border-slate-800/60">
                                <span className="grayscale-[0.3]">{displayEmoji}</span> 
                                <span className="truncate max-w-17.5">{ing.name}</span>
                            </span>
                        )
                    })}
                    {recipe.ingredients.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-600 self-center pl-1">
                            +{recipe.ingredients.length - 4}..
                        </span>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="px-4 pb-4 pt-2 flex flex-col gap-3 border-t border-slate-800/50 relative z-10 mt-auto">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-slate-400 border border-slate-800 text-xs font-bold">
                        <Clock size={12} /> {recipe.prepTimeMinutes}m
                    </span>
                    {/* StarRating necessita click, així que pointer-events-auto */}
                    <div className="pointer-events-auto">
                        <StarRating 
                            recipeId={recipe.id} 
                            average={recipe.ratingSummary?.average || 0} 
                            count={recipe.ratingSummary?.count || 0}
                            initialUserRating={userRating || 0}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
                    <div className={`p-1 rounded-full ${isAi ? 'bg-emerald-500/10 text-emerald-400' : (isAuthor ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400')}`}>
                        {isAi ? <Bot size={10} /> : (isAuthor ? <User size={10} /> : <ChefHat size={10} />)}
                    </div>
                    <span className={`text-[10px] font-medium truncate ${isAi ? 'text-emerald-300' : (isAuthor ? 'text-purple-300' : 'text-slate-500')}`}>
                        {displayAuthorName}
                    </span>
                </div>
            </div>
        </div>
    );
}