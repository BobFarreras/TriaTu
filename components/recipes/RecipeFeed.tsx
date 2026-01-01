'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { motion } from 'framer-motion';
import { RecipeCard } from './RecipeCard';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // ✅

interface Props {
  recipes: RecipeProps[];
  userId?: string;
  userRatings: Record<string, number>;
  totalPages: number;
  currentPage: number;
}

export function RecipeFeed({ recipes, userId, userRatings, totalPages, currentPage }: Props) {
  const { t } = useLanguage(); // ✅
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
          {recipes.map((recipe, index) => (
            <RecipeCard 
              key={recipe.id || index} 
              recipe={recipe} 
              userId={userId}
              userRating={userRatings[recipe.id] || 0}
            />
          ))}
      </motion.div>

      {/* EMPTY STATE */}
      {recipes.length === 0 && (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <div className="text-6xl mb-4 grayscale opacity-50">🥣</div>
            <p className="text-slate-400 font-medium">{t.community.empty_state}</p> {/* ✅ */}
        </div>
      )}

      {/* PAGINACIÓ */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Link
            href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
            className={`w-10 h-10 flex items-center justify-center font-bold text-white bg-slate-800 rounded-full hover:bg-slate-700 transition-all ${currentPage === 1 ? 'opacity-30 pointer-events-none' : ''}`}
          >
            ←
          </Link>
          
          <span className="text-xs text-slate-500 font-mono">
             {t.community.pagination.page} <span className="text-white">{currentPage}</span> {t.community.pagination.of} {totalPages}
          </span>

          <Link
            href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
            className={`w-10 h-10 flex items-center justify-center font-bold text-white bg-slate-800 rounded-full hover:bg-slate-700 transition-all ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : ''}`}
          >
            →
          </Link>
        </div>
      )}
    </div>
  );
}