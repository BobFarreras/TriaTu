// src/components/recipes/editor/steps/StepsList.tsx
'use client'

import { RecipeStep, Ingredient } from '../types';
import { Reorder, AnimatePresence } from 'framer-motion';
import { Trash2, GripVertical, ListChecks } from 'lucide-react';
import { RefObject } from 'react';
// Necessitem els presets per recuperar l'emoji original
import { FOOD_PRESETS } from "@/lib/food-presets"; 

// ✅ COMPONENT MÀGIC MILLORAT: Ara sap pintar Quantitats i Emojis
function HighlightedContent({ content, ingredients }: { content: string, ingredients: Ingredient[] }) {
  // Regex per capturar [Nom] o ⏰ Temps
  const parts = content.split(/(\[.*?\]|⏰\s*\d+\s?min)/g);

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-sm">
      {parts.map((part, i) => {
        // CAS 1: TEMPS (Lila)
        if (part.startsWith('⏰')) {
            return (
                <span key={i} className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-md text-xs font-bold mx-1 border border-purple-500/20 align-baseline select-none shadow-sm">
                    {part}
                </span>
            );
        }
        
        // CAS 2: INGREDIENT [Nom] -> Busquem EMOJI i QUANTITAT
        if (part.startsWith('[') && part.endsWith(']')) {
            const cleanName = part.slice(1, -1); // Treiem els claudàtors
            
            // 🔍 BUSQUEM LES DADES REALS
            const ingredientData = ingredients.find(ing => ing.name === cleanName);
            const preset = FOOD_PRESETS.find(p => p.name === cleanName);
            
            // Si trobem l'ingredient, mostrem tota la info. Si no, mostrem només el nom.
            const emoji = preset ? preset.emoji : '🥘';
            const quantityLabel = ingredientData ? `${ingredientData.quantity}${ingredientData.unit}` : '';

            return (
                <span key={i} className="inline-flex items-center gap-1.5 bg-slate-800 text-emerald-100 px-2 py-0.5 rounded-lg text-xs font-bold mx-1 border border-slate-700 align-baseline select-none shadow-sm group/chip">
                    <span className="text-sm">{emoji}</span>
                    <span>{cleanName}</span>
                    {quantityLabel && (
                        <span className="bg-slate-950/50 text-slate-400 px-1 rounded text-[10px] font-mono group-hover/chip:text-white transition-colors">
                            {quantityLabel}
                        </span>
                    )}
                </span>
            );
        }
        
        // CAS 3: Text normal
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

interface Props {
  steps: RecipeStep[];
  // ✅ NOVA PROP: Necessitem els ingredients per fer el "lookup"
  ingredients: Ingredient[]; 
  onReorder: (steps: RecipeStep[]) => void;
  onRemove: (id: string) => void;
  listEndRef: RefObject<HTMLDivElement | null>;
  labels: { 
      title: string; 
      empty_state: string; 
      [key: string]: string 
  };
}

export function StepsList({ steps, ingredients, onReorder, onRemove, listEndRef, labels }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950/40 relative">
        <div className="p-4 pb-2 shrink-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 z-10 flex justify-between items-center">
             <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <span className="text-lg">📋</span> {labels.title} ({steps.length})
             </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-32">
            <Reorder.Group axis="y" values={steps} onReorder={onReorder} className="space-y-3">
                <AnimatePresence initial={false}>
                    {steps.map((step, index) => (
                        <Reorder.Item 
                            key={step.id} 
                            value={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative flex gap-3 group"
                        >
                            <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
                                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-purple-500 group-hover:text-purple-400 transition-colors shadow-sm cursor-grab active:cursor-grabbing">
                                    {index + 1}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="w-px h-full bg-slate-800 group-hover:bg-slate-700" />
                                )}
                            </div>

                            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 pr-8 text-slate-200 group-hover:border-slate-700 transition-colors relative shadow-sm">
                                
                                {/* ✅ Passem els ingredients al renderitzador */}
                                <HighlightedContent content={step.content} ingredients={ingredients} />
                                
                                <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical className="text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400" size={14} />
                                    <button onClick={() => onRemove(step.id)} className="text-slate-600 hover:text-red-400 p-0.5 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </AnimatePresence>
            </Reorder.Group>
            
            <div ref={listEndRef} />
            
            {steps.length === 0 && (
                <div className="text-center py-10 opacity-30">
                    <ListChecks size={40} className="mx-auto mb-2 text-slate-500" />
                    <p className="text-xs">{labels.empty_state}</p>
                </div>
            )}
        </div>
    </div>
  );
}