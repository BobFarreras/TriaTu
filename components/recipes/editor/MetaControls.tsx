'use client'

import { ArrowLeft, Minus, Plus, Clock, Tag } from 'lucide-react';
import { EditorData } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { useEffect, useRef, CSSProperties } from 'react';

interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  hasError?: boolean;
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
  if (n.includes('sopa') || n.includes('brou')) return '🥣';
  if (n.includes('entrepà') || n.includes('bocata')) return '🥪';
  return '🥘';
}

export function MetaControls({ data, update, hasError }: Props) {
  const { t } = useLanguage();
  const labels = t.create_recipe.meta;
  const tagsDict = labels.tags;

  const titleEmoji = getTitleEmoji(data.name);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const TAGS = [
    { id: 'quick', label: tagsDict.quick, emoji: '⚡', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20' },
    { id: 'healthy', label: tagsDict.healthy, emoji: '💚', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20' },
    { id: 'vegan', label: tagsDict.vegan, emoji: '🌱', color: 'text-green-400 border-green-500/30 bg-green-900/20' },
    { id: 'vegetarian', label: tagsDict.vegetarian, emoji: '🥗', color: 'text-lime-400 border-lime-500/30 bg-lime-900/20' },
    { id: 'gluten-free', label: tagsDict.gluten_free, emoji: '🌾', color: 'text-amber-400 border-amber-500/30 bg-amber-900/20' },
    { id: 'dairy-free', label: tagsDict.dairy_free, emoji: '🥛', color: 'text-blue-300 border-blue-500/30 bg-blue-900/20' },
    { id: 'dessert', label: tagsDict.dessert, emoji: '🍰', color: 'text-pink-400 border-pink-500/30 bg-pink-900/20' },
    { id: 'spicy', label: 'Picant', emoji: '🌶️', color: 'text-red-400 border-red-500/30 bg-red-900/20' },
  ];

  const TIME_PRESETS = [15, 30, 45, 60, 90];

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [data.name]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* 1. SECCIÓ TÍTOL (Gran i vistós) */}
      <section className="relative">
        <div className="flex items-start gap-4">
           {/* Botó Enrere flotant a l'esquerra només en desktop si cal, o integrat */}
           <Link href="/recipes" className="sm:hidden absolute -top-12 left-0 p-2 text-slate-400 hover:text-white">
              <ArrowLeft size={24} />
           </Link>

           <AnimatePresence mode='wait'>
             <motion.div
               key={titleEmoji}
               initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
               animate={{ scale: 1, rotate: 0, opacity: 1 }}
               exit={{ scale: 0.5, rotate: 20, opacity: 0 }}
               className="text-5xl sm:text-6xl shrink-0 filter drop-shadow-lg pt-1"
             >
               {titleEmoji}
             </motion.div>
           </AnimatePresence>

           <div className="flex-1 min-w-0">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Nom de la Recepta</label>
              <textarea
                id="tour-recipe-title"
                ref={textareaRef}
                rows={1}
                value={data.name}
                onChange={(e) => update({ ...data, name: e.target.value })}
                placeholder={hasError ? "⚠️ Com es diu això tan bo?" : labels.placeholder_name}
                className={`w-full bg-transparent text-3xl sm:text-4xl font-black text-white placeholder:text-slate-700 outline-none resize-none overflow-hidden leading-tight border-b-2 transition-colors ${hasError ? 'border-red-500/50' : 'border-transparent focus:border-slate-700'}`}
                style={{ fieldSizing: 'content' } as unknown as CSSProperties}
              />
           </div>
        </div>
      </section>

      <div className="h-px bg-slate-800/50 w-full" />

      {/* 2. SECCIÓ TEMPS */}
      <section className="space-y-3">
         <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Clock size={18} className="text-purple-400" />
            <span className="text-sm font-bold uppercase tracking-wider">Temps de Preparació</span>
         </div>
         
         <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
               
               {/* Comptador Gran */}
               <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800 shadow-inner">
                  <button onClick={() => adjustTime(-5)} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors active:scale-95">
                     <Minus size={18} />
                  </button>
                  <div className="text-center w-16">
                     <span className="block text-2xl font-black text-white font-mono leading-none">{data.prepTimeMinutes}</span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase">min</span>
                  </div>
                  <button onClick={() => adjustTime(5)} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors active:scale-95">
                     <Plus size={18} />
                  </button>
               </div>

               {/* Presets Ràpids */}
               <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                  {TIME_PRESETS.map(t => (
                     <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`
                           px-4 py-2 rounded-xl text-sm font-bold border transition-all whitespace-nowrap
                           ${data.prepTimeMinutes === t 
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-105' 
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                           }
                        `}
                     >
                        {t} min
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </section>

      <div className="h-px bg-slate-800/50 w-full" />

      {/* 3. SECCIÓ ETIQUETES */}
      <section className="space-y-3">
         <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Tag size={18} className="text-emerald-400" />
            <span className="text-sm font-bold uppercase tracking-wider">Etiquetes i Dieta</span>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {TAGS.map(tag => {
               const isActive = data.dietaryTags.includes(tag.id);
               return (
                  <button
                     key={tag.id}
                     onClick={() => toggleTag(tag.id)}
                     className={`
                        relative flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-left group overflow-hidden
                        ${isActive 
                           ? `bg-slate-900 border-slate-700 ${tag.color.split(' ')[0]} shadow-inner` 
                           : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:bg-slate-800 hover:border-slate-700'
                        }
                     `}
                  >
                     <span className="text-xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">{tag.emoji}</span>
                     <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-300'}`}>
                        {tag.label}
                     </span>
                     
                     {/* Marc brillant quan actiu */}
                     {isActive && (
                        <motion.div 
                           layoutId={`active-tag-${tag.id}`}
                           className={`absolute inset-0 border-2 rounded-xl opacity-50 ${tag.color.split(' ')[1]}`} 
                        />
                     )}
                  </button>
               );
            })}
         </div>
      </section>

    </div>
  );
}