// src/components/recipes/RecipeCard.tsx
'use client';

import Link from 'next/link';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { useLanguage } from '@/lib/i18n/LanguageContext';
// ✅ FIX: Corregit 'foot' per 'food'
import { getIngredientEmoji, getMainRecipeEmoji } from '@/lib/foot-presets/matcher';

// ✅ DEFINICIÓ DE TIPUS ESTESA (Mapeig UI)
// Això evita fer servir 'any' i ens permet accedir a propietats opcionals 
// que poden venir del JOIN de base de dades encara que no estiguin al Core pur.
type ExtendedRecipe = RecipeProps & {
  authorName?: string; 
  pricePerPerson?: number;
  tags?: string[]; // Assegurem que tags sigui accessible
};

interface Props {
  recipe: ExtendedRecipe; // Usem el tipus estès
  userId?: string;
  userRating: number;
}

export function RecipeCard({ recipe, userId, userRating }: Props) {
  const { t } = useLanguage();

  const labels = t.create_recipe.card;

  // ✅ LÒGICA VISUAL (Sense 'any')
  const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
  const mainEmoji = getMainRecipeEmoji(recipe.name, tags);
  const isAuthor = recipe.authorId === userId;

  // Formateig de preu (Només si existeix)
  const priceDisplay = recipe.pricePerPerson 
      ? `${recipe.pricePerPerson.toFixed(2)}€` 
      : null;

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
        <span className="sr-only">Veure {recipe.name}</span>
      </Link>

      {/* --- CAPÇALERA --- */}
      <div className="relative p-5 flex gap-4 items-center bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-800">
        <div className="shrink-0 w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          {mainEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-slate-100 leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
            {recipe.name}
          </h2>
          {/* ✅ SUBTÍTOL AMB AUTOR */}
          <p className="text-xs text-slate-400 mt-1 truncate">
             {isAuthor ? (
                 <span className="text-purple-400 font-bold">👤 Tu</span>
             ) : (
                 // Si tenim el nom de l'autor, el mostrem, sinó generic
                 <span>Per {recipe.authorName || 'Chef Anònim'}</span>
             )}
          </p>
        </div>
      </div>

      {/* --- COS (INGREDIENTS) --- */}
      <div className="p-5 flex flex-col gap-5 flex-1 bg-slate-900">
        <div className="flex flex-wrap gap-2 content-start">
          {recipe.ingredients.slice(0, 4).map((ing, i) => {
            // ✅ Usem el matcher connectat als teus presets reals
            const ingEmoji = getIngredientEmoji(ing.name);
            return (
              <motion.span
                key={i}
                whileHover={{ scale: 1.1, backgroundColor: "#334155" }}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-950 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-800 shadow-sm transition-colors"
              >
                <span className="text-sm">{ingEmoji}</span>
                <span className="truncate max-w-[80px]">{ing.name}</span>
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
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
            {/* Temps */}
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <span className="bg-slate-800/50 px-2 py-1 rounded-md flex items-center gap-1">
                     ⏱️ {recipe.prepTimeMinutes} min
                </span>
            </div>

            {/* ✅ PREU (Si existeix) */}
            {priceDisplay && (
                 <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-900/30">
                    <span>💰</span> {priceDisplay}
                 </div>
             )}
        </div>

        <div className="scale-90 origin-right">
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