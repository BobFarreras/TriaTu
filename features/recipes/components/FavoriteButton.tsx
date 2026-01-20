// ARXIU: src/components/recipes/FavoriteButton.tsx
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavoriteAction } from '@/app/actions/recipe-actions'
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Props {
    recipeId: string;
    initialIsFavorite: boolean;
    className?: string;
}

export function FavoriteButton({ recipeId, initialIsFavorite, className = "" }: Props) {
    const [isFav, setIsFav] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Evitem obrir la recepta si estem a la card
        e.stopPropagation();
        
        if (isLoading) return;

        // UI Optimista (Canviem visualment JA)
        const newState = !isFav;
        setIsFav(newState);
        setIsLoading(true);

        const result = await toggleFavoriteAction(recipeId);

        if (!result.success) {
            // Si falla, revertim
            setIsFav(!newState);
            toast.error("Error guardant favorit");
        }
        
        setIsLoading(false);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleToggle}
            disabled={isLoading}
            className={`
                flex items-center justify-center rounded-full p-2 transition-all
                ${isFav 
                    ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' 
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'}
                ${className}
            `}
        >
            <Heart 
                size={18} 
                className={isFav ? "fill-current" : ""} 
                strokeWidth={2.5}
            />
        </motion.button>
    );
}