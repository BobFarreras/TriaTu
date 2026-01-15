'use client'

import { ArrowDown, Plus, Mic, MicOff, ShoppingBasket } from 'lucide-react';
import { EditorData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { RefObject, useEffect, useState } from 'react';
import { useSpeechToText } from '@/hooks/useSpeechToText';

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
  
  // 🎙️ INTEGRACIÓ DE VEU
  const { isListening, transcript, interimTranscript, startListening, stopListening, clearTranscript } = useSpeechToText();

  // Estat per controlar imatges trencades
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // 1. GESTIÓ DEL TEXT FINAL
  useEffect(() => {
    if (transcript) {
        insertToken(transcript + ' ');
        clearTranscript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAdd();
    }
  };

  const insertToken = (token: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
        onChangeText(currentText + (currentText ? ' ' : '') + token);
        return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textBefore = currentText.substring(0, start);
    const textAfter = currentText.substring(end);
    
    const prefix = (textBefore.length > 0 && !textBefore.endsWith(' ') && !token.startsWith(' ')) ? ' ' : '';
    const suffix = (textAfter.length > 0 && !textAfter.startsWith(' ') && !token.endsWith(' ')) ? ' ' : '';
    
    const newText = `${textBefore}${prefix}${token}${suffix}${textAfter}`;
    onChangeText(newText);

    setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + prefix.length + token.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const getDisplayValue = () => {
    if (isListening && interimTranscript) {
        const spacer = (currentText && !currentText.endsWith(' ')) ? ' ' : '';
        return currentText + spacer + interimTranscript;
    }
    return currentText;
  };

  return (
    <div className="flex flex-col h-[45vh] lg:h-full lg:bg-slate-950/20 relative">
        
        {/* --- CONTEXT BAR (Estil IngredientDock) --- */}
        <div id="tour-step-chips" className="shrink-0 p-3 bg-slate-900/50 border-b border-slate-800 max-h-40 overflow-y-auto custom-scrollbar">
           <div className="flex flex-wrap gap-2 items-center">
             
             {/* 1. BOTÓ DE TEMPS (Estil coherent però diferenciat) */}
             <button 
                onClick={() => insertToken(`⏰ ${data.prepTimeMinutes} min`)}
                className="group flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-purple-900/20 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all active:scale-95 h-[42px]"
             >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-purple-500/30">
                    <span className="text-base">⏰</span>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Temps</span>
                    <span className="text-xs font-mono font-bold text-purple-200 group-hover:text-white leading-none">
                        {data.prepTimeMinutes}m
                    </span>
                </div>
             </button>

             {/* SEPARADOR VERTICAL */}
             <div className="w-px h-8 bg-slate-800 mx-1"></div>

             {/* 2. INGREDIENTS (Estil IDÈNTIC a IngredientDock) */}
             {data.ingredients.map((ing, i) => {
                // Comprovem imatge (mateixa lògica que el Dock)
                const hasImage = ing.image && !imgErrors[ing.id];
                const displayEmoji = ing.emoji || '📦';
                
                // Si té imatge, li donem l'estil "Premium" del Dock (fons verdós/blau)
                // Si no, un estil més neutre
                const cardStyle = hasImage
                    ? 'bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-slate-800'
                    : 'bg-slate-800 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/80';

                return (
                  <button 
                      key={ing.id || i} 
                      onClick={() => insertToken(`[${ing.name}]`)}
                      className={`
                        group relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border transition-all active:scale-95 h-[42px]
                        ${cardStyle}
                      `}
                  >
                      {/* FOTO O EMOJI (Estil IngredientDock: quadrat arrodonit blanc) */}
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm ring-1 ring-black/10">
                          {hasImage ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img 
                                src={ing.image} 
                                alt={ing.name}
                                className="w-full h-full object-contain p-0.5"
                                onError={() => setImgErrors(prev => ({ ...prev, [ing.id]: true }))}
                              />
                          ) : (
                              <span className="text-lg leading-none">{displayEmoji}</span>
                          )}
                      </div>

                      {/* INFO TEXT */}
                      <div className="flex flex-col items-start min-w-0">
                          <span className="text-xs font-bold text-slate-200 truncate max-w-[100px] leading-tight">
                              {ing.name}
                          </span>
                          
                          {/* Quantitat petita a sota (opcional, per donar context) */}
                          <span className="text-[9px] text-slate-400 font-mono leading-none mt-0.5">
                              {ing.quantity} {ing.unit}
                          </span>
                      </div>

                      {/* Icona '+' petita que apareix al hover per indicar "Afegir" */}
                      <Plus size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                  </button>
                );
             })}

             {/* 3. AVIS BUIT */}
             {data.ingredients.length === 0 && (
                <div className="flex items-center gap-2 text-slate-500 italic py-2 px-2 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
                   <ShoppingBasket size={14} />
                   <span className="text-xs">Afegeix productes per veure'ls aquí...</span>
                </div>
             )}
           </div>
        </div>

        {/* --- EDITOR HEADER --- */}
        <div className="p-4 pb-0 shrink-0 flex justify-between items-end">
             <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-2">
                    <span className="text-lg">✍️</span> {labels.new_step_title}
                </h3>
                <p className="text-[10px] text-slate-600 mb-2">{labels.new_step_desc}</p>
             </div>

             {/* BOTÓ MIC */}
             <button
                onClick={isListening ? stopListening : startListening}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                    ${isListening 
                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }
                `}
             >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                {isListening ? 'Escoltant...' : 'Dictar'}
             </button>
        </div>

        {/* --- TEXTAREA --- */}
        <div id="tour-step-textarea" className="flex-1 p-4 pt-0 relative group min-h-0">
            <textarea
                ref={textareaRef}
                value={getDisplayValue()}
                onChange={(e) => onChangeText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Parla ara, t'estic escoltant..." : labels.placeholder}
                className={`
                    w-full h-full bg-slate-900 border rounded-2xl p-4 text-base text-white outline-none resize-none transition-all leading-relaxed
                    ${isListening 
                        ? 'border-red-500/50 ring-1 ring-red-500/20 placeholder:text-red-400/50' 
                        : 'border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 placeholder:text-slate-600'
                    }
                `}
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