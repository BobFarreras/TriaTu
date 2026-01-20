'use client';

import { RefObject } from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import { Trash2, GripVertical, Pencil, ListChecks } from 'lucide-react';
import { RecipeStep, Ingredient } from '../types';
// Importem el contingut renderitzat
import { HighlightedContent } from './list/HighlightedContent';

interface Props {
  steps: RecipeStep[];
  ingredients: Ingredient[];
  onReorder: (steps: RecipeStep[]) => void;
  onRemove: (id: string) => void;
  onEdit: (step: RecipeStep) => void;
  editingId: string | null;
  listEndRef: RefObject<HTMLDivElement | null>;
  labels: { title: string; empty_state: string; [key: string]: string };
}

export function StepsList({
  steps,
  ingredients,
  onReorder,
  onRemove,
  onEdit,
  editingId,
  listEndRef,
  labels,
}: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950/40 relative">
      {/* HEADER */}
      <div className="p-4 pb-2 shrink-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 z-10 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
          <span className="text-lg">📋</span> {labels.title} ({steps.length})
        </h3>
      </div>

      {/* LLISTA */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-32">
        <Reorder.Group axis="y" values={steps} onReorder={onReorder} className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {steps.map((step, index) => {
              const isEditing = step.id === editingId;
              
              return (
                <Reorder.Item
                  key={step.id}
                  value={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative flex gap-3 group touch-manipulation"
                >
                  {/* NÚMERO */}
                  <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
                    <div
                      className={`
                        w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black transition-colors shadow-sm cursor-grab active:cursor-grabbing select-none
                        ${isEditing
                          ? 'bg-purple-600 border-purple-500 text-white scale-110 shadow-purple-500/40'
                          : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:border-purple-500 group-hover:text-purple-400'
                        }
                      `}
                    >
                      {isEditing ? <Pencil size={12} /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-px h-full bg-slate-800 group-hover:bg-slate-700" />
                    )}
                  </div>

                  {/* CONTINGUT */}
                  <div
                    onClick={() => onEdit(step)}
                    className={`
                      flex-1 border rounded-xl p-3 pr-8 transition-all relative shadow-sm cursor-pointer select-none
                      ${isEditing
                        ? 'bg-purple-900/10 border-purple-500/50 ring-1 ring-purple-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-800'
                      }
                    `}
                  >
                    {/* 👇 AQUÍ PASSEM ELS INGREDIENTS PERQUÈ ELS TROBI */}
                    <HighlightedContent content={step.content} ingredients={ingredients} />

                    {/* CONTROLS */}
                    <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical
                        className="text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400"
                        size={14}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(step.id);
                        }}
                        className="text-slate-600 hover:text-red-400 p-0.5 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </AnimatePresence>
        </Reorder.Group>

        <div ref={listEndRef} />

        {steps.length === 0 && (
          <div className="text-center py-10 opacity-30 select-none">
            <ListChecks size={40} className="mx-auto mb-2 text-slate-500" />
            <p className="text-xs">{labels.empty_state}</p>
          </div>
        )}
      </div>
    </div>
  );
}