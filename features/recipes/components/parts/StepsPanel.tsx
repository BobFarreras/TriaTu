'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { HighlightedContent } from '@/components/recipes/editor/steps/list/HighlightedContent';
import { Ingredient as EditorIngredient } from '@/components/recipes/editor/types';
import { IngredientWithMeta } from './IngredientsPanel';

interface Props {
    steps: string[] | { id: string; content: string }[];
    ingredients: IngredientWithMeta[];
}

export function StepsPanel({ steps, ingredients }: Props) {
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleStep = (index: number) => {
        const next = new Set(completedSteps);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        setCompletedSteps(next);
    };

    const normalizedSteps = steps.map(s => {
        if (typeof s === 'string') return s;
        return s.content || "";
    });

    const safeIngredients: EditorIngredient[] = ingredients.map((ing, i) => ({
        id: ing.id || `temp-id-${i}`,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        emoji: ing.emoji || '🥘',
        image: ing.image,
        linkedProductImage: ing.linkedProductImage as string | undefined,
        estimatedCost: ing.estimatedCost as number | undefined,
        linkedProductId: (ing.linkedProductId as string) || undefined
    }));

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            {/* HEADER CLICABLE */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center p-5 md:p-6 bg-slate-900/30 hover:bg-slate-900/50 transition-colors border-b border-slate-800/50"
            >
                <div className="flex items-center gap-3">
                    <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                        <span className="text-2xl">👨‍🍳</span> {t.community.steps.title}
                    </h3>
                    <span className="text-[10px] font-bold bg-slate-950 text-slate-400 px-3 py-1 rounded-full border border-slate-800 uppercase tracking-wider">
                        {completedSteps.size}/{steps.length}
                    </span>
                </div>
                
                <ChevronDown 
                    className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    size={20} 
                />
            </button>

            {/* CONTINGUT PLEGABLE */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-4 md:p-6 relative space-y-4 md:space-y-6 pb-8 md:pb-12">
                            {/* Línia connectora de fons */}
                            <div className="absolute left-[27px] md:left-[35px] top-6 bottom-10 w-0.5 bg-slate-800/50 -z-10" />

                            {normalizedSteps.length > 0 ? normalizedSteps.map((stepText, i) => {
                                const isDone = completedSteps.has(i);
                                
                                return (
                                    <motion.div
                                        key={i}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => toggleStep(i)} // Clic a tota la targeta
                                        className={`
                                            relative flex gap-4 md:gap-6 group select-none cursor-pointer
                                            ${isDone ? 'opacity-50 grayscale' : 'opacity-100'}
                                        `}
                                    >
                                        {/* CHECK / NÚMERO (Fixat a l'esquerra) */}
                                        <div className="shrink-0 pt-1 relative z-10">
                                            <div className={`
                                                w-8 h-8 md:w-10 md:h-10 rounded-full border-4 flex items-center justify-center text-xs md:text-sm font-bold shadow-xl transition-all duration-300
                                                ${isDone
                                                    ? 'bg-emerald-500 border-slate-950 text-white scale-90'
                                                    : 'bg-slate-900 border-slate-950 text-slate-400 group-hover:border-purple-500 group-hover:text-white'
                                                }
                                            `}>
                                                {isDone ? <CheckCircle2 size={18} /> : i + 1}
                                            </div>
                                        </div>

                                        {/* CONTINGUT (Flexible però sense overflow hidden agressiu) */}
                                        <div className={`
                                            flex-1 p-4 md:p-5 rounded-2xl border transition-all duration-300 relative
                                            ${isDone
                                                ? 'bg-transparent border-transparent text-slate-600'
                                                : 'bg-slate-900/60 border-slate-800/50 text-slate-200 shadow-lg backdrop-blur-sm group-hover:border-purple-500/30 group-hover:bg-slate-900/80'
                                            }
                                        `}>
                                            {!isDone && <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />}

                                            <div className={`text-base md:text-lg leading-relaxed ${isDone ? 'line-through decoration-slate-700' : ''}`}>
                                                {/* ✅ MODE INTERACTIU ACTIVAT */}
                                                <HighlightedContent 
                                                    content={stepText} 
                                                    ingredients={safeIngredients} 
                                                    interactive={true} 
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }) : (
                                <div className="text-center py-10 opacity-50 border-2 border-dashed border-slate-800 rounded-3xl">
                                    <p>{t.community.steps.empty}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}