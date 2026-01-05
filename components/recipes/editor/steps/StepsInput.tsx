// src/components/recipes/editor/steps/StepsInput.tsx
'use client'

import { ArrowDown, ShoppingBasket, Plus } from 'lucide-react';
import { EditorData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { RefObject } from 'react';
import { FOOD_PRESETS } from "@/lib/food-presets";

interface Props {
    data: EditorData;
    currentText: string;
    onChangeText: (text: string) => void;
    onAdd: () => void;
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    labels: {
        new_step_title: string;
        new_step_desc: string;
        placeholder: string;
        [key: string]: string
    };
}

export function StepsInput({ data, currentText, onChangeText, onAdd, textareaRef, labels }: Props) {

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onAdd();
        }
    };

    const insertToken = (token: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = currentText.substring(0, start);
        const textAfter = currentText.substring(end);

        const prefix = (textBefore.length > 0 && !textBefore.endsWith(' ')) ? ' ' : '';
        const suffix = (textAfter.length > 0 && !textAfter.startsWith(' ')) ? ' ' : '';

        const newText = `${textBefore}${prefix}${token}${suffix}${textAfter}`;

        onChangeText(newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + token.length + suffix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 50);
    };

    return (
        <div className="flex flex-col h-[45vh] lg:h-full lg:bg-slate-950/20 relative">

            {/* CONTEXT BAR */}
            <div className="shrink-0 p-3 bg-slate-900/50 border-b border-slate-800 max-h-32 overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-2">

                    {/* 1. VARIABLE DE TEMPS (Format compatible amb StepsPanel: ⏰) */}
      
                    <button
                        onClick={() => insertToken(`⏰ ${data.prepTimeMinutes} min`)}
                        className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-purple-900/30 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all active:scale-95"
                        title="Inserir temps"
                    >
                        {/* ✅ CANVI: Usem l'emoji directament perquè quedi clar què s'inserirà */}
                        <span className="text-sm">⏰</span>
                        <span className="text-xs font-bold font-mono text-purple-200 group-hover:text-white">
                            {data.prepTimeMinutes}m
                        </span>
                        <Plus size={10} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity -mr-1" />
                    </button>

                    {/* 2. VARIABLES D'INGREDIENTS (Format compatible: [Nom]) */}
                    {data.ingredients.length > 0 ? (
                        data.ingredients.map((ing, i) => {
                            const preset = FOOD_PRESETS.find(p => p.name === ing.name);
                            const emoji = preset ? preset.emoji : '🥘';

                            // ✅ GENEREM EL TOKEN QUE ESPERA STEPSPANEL: [Nom]
                            const tokenText = `[${ing.name}]`;

                            return (
                                <button
                                    key={i}
                                    onClick={() => insertToken(tokenText)}
                                    className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-600 transition-all active:scale-95 text-slate-300 hover:text-white"
                                >
                                    <span className="text-sm leading-none">{emoji}</span>
                                    <span className="text-xs font-medium">{ing.name}</span>
                                    <span className="text-[10px] bg-slate-900 px-1 rounded text-slate-500 font-mono group-hover:bg-slate-700 group-hover:text-slate-300 transition-colors">
                                        {ing.quantity}{ing.unit}
                                    </span>
                                </button>
                            );
                        })
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 italic px-2 py-1.5">
                            <ShoppingBasket size={12} /> Selecciona ingredients primer
                        </div>
                    )}
                </div>
            </div>

            {/* EDITOR */}
            <div className="p-4 pb-0 shrink-0">
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-2">
                    <span className="text-lg">✍️</span> {labels.new_step_title}
                </h3>
                
            </div>

            <div className="flex-1 p-4 pt-0 relative group min-h-0">
                <textarea
                    ref={textareaRef}
                    value={currentText}
                    onChange={(e) => onChangeText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={labels.placeholder}
                    className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-base text-white placeholder:text-slate-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-none transition-all leading-relaxed"
                />

                <AnimatePresence>
                    {currentText.trim() && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onAdd}
                            className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl shadow-lg shadow-purple-900/20 border border-purple-400/20 z-10"
                        >
                            <ArrowDown size={24} strokeWidth={3} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}