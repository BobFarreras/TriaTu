'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { HighlightedContent } from '@/components/recipes/editor/steps/list/HighlightedContent';
// Importem el tipus Ingredient de l'editor per fer-lo servir com a referència
import { Ingredient as EditorIngredient } from '@/components/recipes/editor/types';
import { IngredientWithMeta } from './IngredientsPanel';


interface Props {
    steps: string[] | { id: string; content: string }[];
    ingredients: IngredientWithMeta[];
}

export function StepsPanel({ steps, ingredients }: Props) {
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const { t } = useLanguage();

    const toggleStep = (index: number) => {
        const next = new Set(completedSteps);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        setCompletedSteps(next);
    };

    // 1. Normalització de Passos (Com abans)
    const normalizedSteps = steps.map(s => {
        if (typeof s === 'string') return s;
        return s.content || "";
    });

    // 2. Normalització d'Ingredients (MÀGIA DE TIPUS ✨)
    // Convertim els ingredients d'entrada (que potser no tenen ID) al format que espera l'Editor
    // 2. Normalització d'Ingredients (MÀGIA DE TIPUS ✨)
    const safeIngredients: EditorIngredient[] = ingredients.map((ing, i) => ({
        id: ing.id || `temp-id-${i}`,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        emoji: ing.emoji || '🥘',
        image: ing.image,
        // Fem cast segur perquè sabem que existeix a InputIngredient
        linkedProductImage: ing.linkedProductImage as string | undefined,
        estimatedCost: ing.estimatedCost as number | undefined,
        // Altres camps requerits per EditorIngredient si cal
        linkedProductId: (ing.linkedProductId as string) || undefined
    }));

    return (
        <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 shadow-xl">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 px-2">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="text-2xl">👨‍🍳</span> {t.community.steps.title}
                </h3>
                <span className="text-[10px] font-bold bg-slate-950 text-slate-400 px-3 py-1 rounded-full border border-slate-800 uppercase tracking-wider">
                    {completedSteps.size} {t.community.pagination.of} {steps.length} {t.community.steps.count_suffix}
                </span>
            </div>

            {/* LISTA */}
            <div className="relative space-y-6 pb-4">
                <div className="absolute left-5 top-4 bottom-10 w-0.5 bg-slate-800/50 -z-10" />

                {normalizedSteps.length > 0 ? normalizedSteps.map((stepText, i) => {
                    const isDone = completedSteps.has(i);

                    return (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => toggleStep(i)}
                            className={`
                                relative flex gap-5 cursor-pointer group select-none
                                ${isDone ? 'opacity-50 grayscale' : 'opacity-100'}
                            `}
                        >
                            {/* CHECK / NÚMERO */}
                            <div className={`
                                w-10 h-10 rounded-full border-4 flex items-center justify-center text-sm font-bold shadow-xl transition-all duration-300 z-10 shrink-0
                                ${isDone
                                    ? 'bg-emerald-500 border-slate-950 text-white scale-90'
                                    : 'bg-slate-900 border-slate-950 text-slate-400 group-hover:border-purple-500 group-hover:text-white'
                                }
                            `}>
                                {isDone ? <CheckCircle2 size={20} /> : i + 1}
                            </div>

                            {/* CONTINGUT */}
                            <div className={`
                                flex-1 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                                ${isDone
                                    ? 'bg-transparent border-transparent text-slate-600'
                                    : 'bg-slate-900/60 border-slate-800/50 text-slate-200 shadow-lg backdrop-blur-sm group-hover:border-purple-500/30 group-hover:bg-slate-900/80'
                                }
                            `}>
                                {!isDone && <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />}

                                <div className={`text-lg leading-relaxed ${isDone ? 'line-through decoration-slate-700' : ''}`}>
                                    {/* ✅ Passem els ingredients normalitzats i segurs */}
                                    <HighlightedContent content={stepText} ingredients={safeIngredients} />
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
        </div>
    );
}