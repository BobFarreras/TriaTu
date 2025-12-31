'use client'

import { useState } from 'react';
import { rateRecipeAction } from '@/app/actions/community';

interface Props {
  recipeId: string;
  initialUserRating?: number; // Si ja ha votat
  average: number;
  count: number;
}

export function StarRating({ recipeId, initialUserRating, average, count }: Props) {
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(initialUserRating || 0);

  const handleRate = async (value: number) => {
    if (loading) return;
    setLoading(true);
    
    const result = await rateRecipeAction(recipeId, value);
    
    if (result?.error) {
      alert(result.error);
    } else {
      setUserRating(value);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            className={`text-2xl transition-transform hover:scale-110 ${
              star <= (userRating || Math.round(average)) 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }`}
            disabled={loading}
          >
            ★
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {average.toFixed(1)} ({count} vots)
      </span>
      {userRating > 0 && <span className="text-xs text-green-600">Has votat!</span>}
    </div>
  );
}