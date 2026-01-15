'use client'

import { ArrowDown, Plus, Mic, MicOff, ShoppingBasket, Check, X, ArrowRight } from 'lucide-react';
import { EditorData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { RefObject, useEffect, useState } from 'react';
import { useSpeechToText } from '@/hooks/useSpeechToText';

interface Props {
  data: EditorData;
  currentText: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  labels: { 
     new_step_title: string; 
     new_step_desc: string; 
     placeholder: string; 
     [key: string]: string 
  };
}

export function StepsInput({ data, currentText, onChangeText, onSave, onCancel, isEditing, textareaRef, labels }: Props) {
  
  const { isListening, transcript, interimTranscript, startListening, stopListening, clearTranscript } = useSpeechToText();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

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
      onSave();
    }
    if (e.key === 'Escape' && isEditing) {
        onCancel();
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
    <div className="flex flex-col h-full bg-slate-950/20 relative overflow-hidden">
        
        {/* --- CONTEXT BAR --- */}
        <div id="tour-step-chips" className="shrink-0 p-3 bg-slate-900/50 border-b border-slate-800 max-h-40 overflow-y-auto custom-scrollbar">
           <div className="flex flex-wrap gap-2 items-center">
             
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

             <div className="w-px h-8 bg-slate-800 mx-1"></div>

             {data.ingredients.map((ing, i) => {
                // ✅ FIX KEY: Usem un string segur combinant index si l'ID és buit o inexistent
                const safeKey = ing.id ? ing.id : `ing-fallback-${i}`;
                
                const hasImage = ing.image && !imgErrors[ing.id];
                const displayEmoji = ing.emoji || '📦';
                const cardStyle = hasImage
                    ? 'bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-slate-800'
                    : 'bg-slate-800 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/80';

                return (
                  <button 
                      key={safeKey} 
                      onClick={() => insertToken(`[${ing.name}]`)}
                      className={`group relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border transition-all active:scale-95 h-[42px] ${cardStyle}`}
                  >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm ring-1 ring-black/10">
                          {hasImage ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={ing.image} alt={ing.name} className="w-full h-full object-contain p-0.5" onError={() => setImgErrors(prev => ({ ...prev, [ing.id]: true }))} />
                          ) : (
                              <span className="text-lg leading-none">{displayEmoji}</span>
                          )}
                      </div>
                      <div className="flex flex-col items-start min-w-0">
                          <span className="text-xs font-bold text-slate-200 truncate max-w-[100px] leading-tight">{ing.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono leading-none mt-0.5">{ing.quantity} {ing.unit}</span>
                      </div>
                      <Plus size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                  </button>
                );
             })}

             {data.ingredients.length === 0 && (
                <div className="flex items-center gap-2 text-slate-500 italic py-2 px-2 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
                   <ShoppingBasket size={14} />
                   <span className="text-xs">Afegeix productes...</span>
                </div>
             )}
           </div>
        </div>

        {/* --- EDITOR HEADER (AMB ACCIONS) --- */}
        <div className="p-4 pb-2 shrink-0 flex justify-between items-center bg-slate-900/20">
             <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isEditing ? 'text-purple-400' : 'text-slate-500'}`}>
                    <span className="text-lg">{isEditing ? '✏️' : '✍️'}</span> 
                    {isEditing ? 'Editant Pas...' : labels.new_step_title}
                </h3>
             </div>

             {/* GRUP DE BOTONS D'ACCIÓ (Junts a la dreta) */}
             <div className="flex items-center gap-2">
                
                {/* 1. CANCEL·LAR (Només editant) */}
                {isEditing && (
                    <motion.button
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        onClick={onCancel}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:bg-red-900/30 hover:text-red-400 hover:border-red-500/50 transition-colors"
                        title="Cancel·lar edició"
                    >
                        <X size={16} strokeWidth={3} />
                    </motion.button>
                )}

                {/* 2. MICRÒFON */}
                <button
                    onClick={isListening ? stopListening : startListening}
                    className={`
                        h-8 px-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border
                        ${isListening 
                            ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-red-500/20 shadow-lg' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                        }
                    `}
                >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    <span className="hidden sm:inline">{isListening ? 'Stop' : 'Dictar'}</span>
                </button>

                {/* 3. GUARDAR / AFEGIR (Botó Principal) */}
                <AnimatePresence mode="popLayout">
                    {(currentText.trim() || isEditing) && (
                        <motion.button
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onSave}
                            className={`
                                h-8 px-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border shadow-lg
                                ${isEditing 
                                    ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500' 
                                    : 'bg-purple-600 text-white border-purple-500 hover:bg-purple-500'
                                }
                            `}
                        >
                            {isEditing ? <Check size={16} strokeWidth={3} /> : <ArrowDown size={16} strokeWidth={3} />}
                            <span className="hidden sm:inline">{isEditing ? 'Guardar' : 'Afegir'}</span>
                        </motion.button>
                    )}
                </AnimatePresence>
             </div>
        </div>

        {/* --- TEXTAREA --- */}
        <div id="tour-step-textarea" className="flex-1 p-4 pt-2 relative group min-h-[200px] flex flex-col">
            <textarea
                ref={textareaRef}
                value={getDisplayValue()}
                onChange={(e) => onChangeText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Parla ara..." : labels.placeholder}
                className={`
                    flex-1 w-full bg-slate-900 border rounded-2xl p-4 text-base text-white outline-none resize-none transition-all leading-relaxed custom-scrollbar
                    ${isListening 
                        ? 'border-red-500/50 ring-1 ring-red-500/20' 
                        : isEditing 
                            ? 'border-purple-500/50 ring-1 ring-purple-500/20 bg-purple-900/10'
                            : 'border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50'
                    }
                `}
            />
            {/* Ja no hi ha botons flotants aquí sota */}
        </div>
    </div>
  );
}