// src/components/recipes/editor/MetaControls.tsx
'use client'

import { ArrowLeft, Minus, Plus, Clock } from 'lucide-react';
import { EditorData } from './types';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
// ✅ CORRECCIÓ: Afegim CSSProperties a l'import
import { useEffect, useRef, CSSProperties } from 'react';

interface Props {
    data: EditorData;
    update: (d: EditorData) => void;
    hasError?: boolean; // ✅ NOVA PROP OPCIONAL
}

function getTitleEmoji(name: string): string {
    const n = name.toLowerCase();
    if (!n) return '✨';
    if (n.includes('pizza')) return '🍕';
    if (n.includes('pasta') || n.includes('macarru')) return '🍝';
    if (n.includes('burger')) return '🍔';
    if (n.includes('amanida') || n.includes('enciam') || n.includes('salad')) return '🥗';
    if (n.includes('pollastre')) return '🍗';
    if (n.includes('arròs') || n.includes('paella')) return '🥘';
    if (n.includes('sushi')) return '🍣';
    if (n.includes('pastís') || n.includes('xocolata') || n.includes('cake')) return '🍰';
    if (n.includes('taco') || n.includes('fajita')) return '🌮';
    if (n.includes('peix') || n.includes('dorada')) return '🐟';
    return '🥘'; 
}

export function MetaControls({ data, update , hasError}: Props) {
  const { t } = useLanguage();
  const labels = t.create_recipe.meta;
  const tagsDict = labels.tags;
  
  const titleEmoji = getTitleEmoji(data.name);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const TAGS = [
    { id: 'quick', label: tagsDict.quick, emoji: '⚡' },
    { id: 'healthy', label: tagsDict.healthy, emoji: '💚' },
    { id: 'vegan', label: tagsDict.vegan, emoji: '🌱' },
    { id: 'vegetarian', label: tagsDict.vegetarian, emoji: '🥗' },
    { id: 'gluten-free', label: tagsDict.gluten_free, emoji: '🌾' },
    { id: 'dairy-free', label: tagsDict.dairy_free, emoji: '🥛' },
    { id: 'dessert', label: tagsDict.dessert, emoji: '🍰' },
    { id: 'spicy', label: 'Picant', emoji: '🌶️' },
  ];

  const TIME_PRESETS = [15, 30, 45, 60];

  const toggleTag = (id: string) => {
    update({
        ...data,
        dietaryTags: data.dietaryTags.includes(id) 
            ? data.dietaryTags.filter(t => t !== id)
            : [...data.dietaryTags, id]
    });
  };

  const adjustTime = (delta: number) => {
    update({ ...data, prepTimeMinutes: Math.max(0, data.prepTimeMinutes + delta) });
  };

  const setTime = (val: number) => {
    update({ ...data, prepTimeMinutes: val });
  };

  // Auto-resize del Textarea quan canvia el contingut
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [data.name]);

  return (
    <div className="shrink-0 z-50 relative">
        {/* Fons Glass */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50" />

        <div className="relative flex flex-col p-4 gap-4">
            
            {/* --- FILA 1: NAV + EMOJI + TÍTOL --- */}
            <div className="flex items-start gap-3">
                <Link href="/recipes" className="p-2 -ml-2 mt-1 text-slate-400 hover:text-white rounded-full transition-colors active:scale-90 bg-slate-900/50 border border-slate-800">
                    <ArrowLeft size={20} />
                </Link>

                {/* Emoji Dinàmic (Fixat a dalt per si el text creix) */}
                <motion.div 
                    key={titleEmoji}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-4xl shrink-0 drop-shadow-md cursor-default select-none pt-1"
                >
                    {titleEmoji}
                </motion.div>

                {/* Títol MULTILÍNIA (Textarea) */}
                <textarea 
                    ref={textareaRef}
                    rows={1}
                    value={data.name}
                    onChange={(e) => update({ ...data, name: e.target.value })}
                    placeholder={hasError ? "⚠️ FALTA EL TÍTOL!" : labels.placeholder_name}
                    className="flex-1 bg-transparent text-2xl sm:text-3xl font-black text-white placeholder:text-slate-700 outline-none resize-none overflow-hidden min-h-11 leading-tight"
                    // ✅ CORRECCIÓ: Usem un cast segur a CSSProperties en lloc de 'any'
                    style={{ fieldSizing: 'content' } as unknown as CSSProperties} 
                />
            </div>

            {/* --- CONTENIDOR CONTROLS (Mobile: Columna / Desktop: Fila) --- */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pl-1">
                
                {/* 1. CONTROL DE TEMPS */}
                <div className="flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 self-start">
                    <div className="px-2 flex items-center gap-1.5 text-slate-400 border-r border-slate-800 mr-1">
                        <Clock size={14} className="text-purple-400" />
                        <span className="text-sm font-mono font-bold w-7 text-center text-white">{data.prepTimeMinutes}</span>
                        <span className="text-[10px] font-bold text-slate-600">min</span>
                    </div>
                    
                    {/* Botons Presets */}
                    {TIME_PRESETS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`
                                w-8 h-8 rounded-lg text-[10px] font-bold transition-all border
                                ${data.prepTimeMinutes === t 
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20 scale-105' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }
                            `}
                        >
                            {t}
                        </button>
                    ))}
                    
                    {/* Ajust manual */}
                    <div className="flex gap-0.5 ml-1">
                         <button onClick={() => adjustTime(-5)} className="w-8 h-8 flex items-center justify-center bg-slate-950 text-slate-500 hover:text-white rounded-l-lg border border-slate-800"><Minus size={12}/></button>
                         <button onClick={() => adjustTime(5)} className="w-8 h-8 flex items-center justify-center bg-slate-950 text-slate-500 hover:text-white rounded-r-lg border border-slate-800"><Plus size={12}/></button>
                    </div>
                </div>

                {/* Separador (Només visible en Desktop) */}
                <div className="hidden sm:block w-px h-8 bg-slate-800 shrink-0" />

                {/* 2. TAGS (A sota del temps en mòbil) */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade-right w-full sm:w-auto pb-1">
                    {TAGS.map(tag => {
                        const isActive = data.dietaryTags.includes(tag.id);
                        return (
                            <button
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-all
                                    ${isActive 
                                        ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                                    }
                                `}
                            >
                                <span className="text-base">{tag.emoji}</span>
                                {tag.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
  );
}