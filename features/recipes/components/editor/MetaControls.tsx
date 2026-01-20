'use client'

import { Minus, Plus, Clock, Tag } from 'lucide-react';
import { EditorData } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useEffect, useRef, CSSProperties } from 'react';

interface Props {
   data: EditorData;
   update: (d: EditorData) => void;
   hasError?: boolean;
   // ✅ Props per al Tour
   titleInputId?: string;
   prepTimeId?: string;
   tagsContainerId?: string;
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

export function MetaControls({
   data,
   update,
   hasError,
   titleInputId,
   prepTimeId,
   tagsContainerId
}: Props) {
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
      // Convertim data.prepTimeMinutes a Number abans de sumar
      const currentTime = Number(data.prepTimeMinutes) || 0;

      update({
         ...data,
         prepTimeMinutes: Math.max(0, currentTime + delta)
      });
   };



   useEffect(() => {
      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
         textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
   }, [data.name]);

   return (
      <div className="flex flex-col gap-8 pb-32"> {/* Més padding bottom pel botó flotant */}

         {/* 1. SECCIÓ TÍTOL */}
         <section className="relative pt-2">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
               {/* EMOJI GEGANT */}
               <div className="flex justify-center sm:justify-start">
                  <AnimatePresence mode='wait'>
                     <motion.div
                        key={titleEmoji}
                        initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: 20, opacity: 0 }}
                        className="text-6xl sm:text-7xl filter drop-shadow-2xl p-2 bg-slate-900/50 rounded-3xl border border-slate-800"
                     >
                        {titleEmoji}
                     </motion.div>
                  </AnimatePresence>
               </div>

               <div className="flex-1 min-w-0 text-center sm:text-left">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Nom de la Recepta</label>
                  <textarea
                     id={titleInputId} // ✅ ID APLICAT
                     ref={textareaRef}
                     rows={1}
                     value={data.name}
                     onChange={(e) => update({ ...data, name: e.target.value })}
                     placeholder={labels.placeholder_name}
                     className={`
                    w-full bg-transparent text-3xl sm:text-5xl font-black text-white placeholder:text-slate-800 outline-none resize-none overflow-hidden leading-tight border-b-2 transition-colors text-center sm:text-left
                    ${hasError ? 'border-red-500/50 placeholder:text-red-900/50' : 'border-transparent focus:border-slate-800'}
                `}
                     style={{ fieldSizing: 'content' } as unknown as CSSProperties}
                  />
               </div>
            </div>
         </section>

         {/* 2. SECCIÓ TEMPS */}
         <section className="space-y-3" id={prepTimeId}> {/* ✅ ID AL CONTENIDOR DE LA SECCIÓ */}
            <div className="flex items-center gap-2 text-slate-400 mb-2 px-1">
               <Clock size={16} className="text-purple-400" />
               <span className="text-xs font-bold uppercase tracking-wider">Temps de Preparació</span>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800 flex flex-col gap-4">
               {/* Control Principal */}
               <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
                  <button onClick={() => adjustTime(-5)} className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl active:scale-95 transition-all">
                     <Minus size={20} />
                  </button>

                  <div className="flex flex-col items-center">
                     <span className="text-3xl font-black text-white font-mono">{data.prepTimeMinutes}</span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase">minuts</span>
                  </div>

                  <button onClick={() => adjustTime(5)} className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-xl active:scale-95 transition-all shadow-lg shadow-purple-500/10">
                     <Plus size={20} />
                  </button>
               </div>

               {/* Presets */}
               <div className="grid grid-cols-5 gap-2">
                  {TIME_PRESETS.map(t => (
                     <button
                        key={t}
                        onClick={() => update({ ...data, prepTimeMinutes: t })}
                        className={`
                        py-2 rounded-xl text-xs font-bold border transition-all
                        ${data.prepTimeMinutes === t
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                              : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                           }
                     `}
                     >
                        {t}
                     </button>
                  ))}
               </div>
            </div>
         </section>

         {/* 3. SECCIÓ ETIQUETES */}
         <section className="space-y-3" id={tagsContainerId}> {/* ✅ ID AL CONTENIDOR DE LA SECCIÓ */}
            <div className="flex items-center gap-2 text-slate-400 mb-2 px-1">
               <Tag size={16} className="text-emerald-400" />
               <span className="text-xs font-bold uppercase tracking-wider">Etiquetes</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
               {TAGS.map(tag => {
                  const isActive = data.dietaryTags.includes(tag.id);
                  return (
                     <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`
                        relative flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left overflow-hidden active:scale-95
                        ${isActive
                              ? `bg-slate-900 border-slate-700 ${tag.color.split(' ')[0]} shadow-lg`
                              : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:bg-slate-900'
                           }
                     `}
                     >
                        <span className="text-2xl">{tag.emoji}</span>
                        <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-white' : 'text-slate-500'}`}>
                           {tag.label}
                        </span>

                        {isActive && (
                           <motion.div
                              layoutId={`active-tag-${tag.id}`}
                              className={`absolute inset-0 border-2 rounded-2xl opacity-20 ${tag.color.split(' ')[1]}`}
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