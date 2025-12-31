'use client'

import { useState } from 'react';
import { rateRecipeAction } from '@/app/actions/community';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Props {
  recipeId: string;
  initialUserRating?: number;
  average: number;
  count: number;
}

export function StarRating({ recipeId, initialUserRating, average, count }: Props) {
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(initialUserRating || 0);

  const handleRate = async (e: React.MouseEvent, value: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);
    
    // Optimistic UI update
    const previousRating = userRating;
    setUserRating(value);

    const result = await rateRecipeAction(recipeId, value);
    
    if (result?.error) {
      toast.error(result.error);
      setUserRating(previousRating); 
    } else {
        toast.success('Vot guardat! ⭐');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3 z-20 relative bg-black/20 px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (userRating || Math.round(average));
          return (
            <motion.button
              key={star}
              whileHover={{ scale: 1.3, rotate: 10 }}
              whileTap={{ scale: 0.8 }}
              onClick={(e) => handleRate(e, star)}
              disabled={loading}
              className={`focus:outline-none text-2xl leading-none transition-colors ${
                  isFilled 
                    ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]' 
                    : 'text-slate-700 hover:text-yellow-200'
              }`}
            >
              ★
            </motion.button>
          );
        })}
      </div>
      
      <div className="flex flex-col leading-none">
          <span className="text-xs font-bold text-white font-mono">
            {average.toFixed(1)}
          </span>
          <span className="text-[9px] text-slate-500">
            ({count})
          </span>
      </div>
    </div>
  );
}