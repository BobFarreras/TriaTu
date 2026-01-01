'use client'

import Link from 'next/link';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getIngredientEmoji } from '@/lib/utils/emojiUtils';

interface Props {
  recipe: RecipeProps;
  userId?: string;
  userRating: number;

}



function getMainEmoji(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('pizza')) return '🍕';
    if (n.includes('hamburg')) return '🍔';
    if (n.includes('pasta')) return '🍝';
    if (n.includes('arròs') || n.includes('paella')) return '🥘';
    if (n.includes('sushi')) return '🍣';
    if (n.includes('amanida')) return '🥗';
    if (n.includes('pastís')) return '🍰';
    if (n.includes('pollastre')) return '🍗';
    if (n.includes('carn')) return '🥩';
    if (n.includes('peix')) return '🐟';
    if (n.includes('taco')) return '🌮';
    if (n.includes('sopa')) return '🥣';
    return '🍽️';
}

export function RecipeCard({ recipe, userId, userRating }: Props) {
  // ✅ 3. AGARREM LES TRADUCCIONS DEL CONTEXT
  const { t } = useLanguage();
  // Fem un àlies per comoditat (assumint que les claus estan a create_recipe.card)
  // Si vols moure-ho a una clau més genèrica com 'common.card', canvia-ho aquí i al diccionari.
  const labels = t.create_recipe.card; 

  const mainEmoji = getMainEmoji(recipe.name);
  const isAuthor = recipe.authorId === userId;

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-purple-500/40"
    >
      <Link href={`/recipes/${recipe.id}`} className="absolute inset-0 z-10" prefetch={false}>
        {/* ✅ Ara labels ja existeix gràcies al hook */}
        <span className="sr-only">{labels.view_sr} {recipe.name}</span>
      </Link>

      {/* --- CAPÇALERA --- */}
      <div className="relative p-5 flex gap-4 items-center bg-linear-to-r from-slate-800 to-slate-900 border-b border-slate-800">
        <div className="shrink-0 w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            {mainEmoji}
        </div>
        <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-slate-100 leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
                {recipe.name}
            </h2>
        </div>
      </div>

      {/* --- COS --- */}
      <div className="p-5 flex flex-col gap-5 flex-1 bg-slate-900">
        <div className="flex flex-wrap gap-2 content-start">
           {recipe.ingredients.slice(0, 4).map((ing, i) => {
             const ingEmoji = getIngredientEmoji(ing.name);
             return (
                <motion.span 
                  key={i} 
                  whileHover={{ scale: 1.1, backgroundColor: "#334155" }}
                  className="inline-flex items-center gap-2 text-xs font-bold bg-slate-950 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 shadow-sm transition-colors"
                >
                  <span className="text-sm">{ingEmoji}</span> 
                  {ing.name}
                </motion.span>
             )
           })}
           {recipe.ingredients.length > 4 && (
             <span className="text-xs font-bold text-slate-500 self-center pl-1">
                +{recipe.ingredients.length - 4}
             </span>
           )}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between relative z-20">
          <div className="flex flex-col gap-1.5">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                    ⏱️ {recipe.prepTimeMinutes}{labels.prep_time}
                </span>
             </div>
             
             <div className={`flex items-center gap-1.5 text-xs ${isAuthor ? 'text-purple-400 font-bold' : 'text-slate-500 font-medium'}`}>
                <span>{isAuthor ? '👤' : '👨‍🍳'}</span>
                <span>{isAuthor ? labels.created_by_you : labels.created_by_community}</span>
             </div>
          </div>

          <div className="scale-100 origin-right">
              <StarRating 
                recipeId={recipe.id} 
                average={recipe.ratingSummary?.average || 0} 
                count={recipe.ratingSummary?.count || 0}
                initialUserRating={userRating || 0}
              />
          </div>
      </div>
    </motion.article>
  );
}