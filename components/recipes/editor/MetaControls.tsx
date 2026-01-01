'use client'

import { Clock } from 'lucide-react';
import { EditorData } from './types';
import { motion } from 'framer-motion';
// ✅ 1. Importem el hook
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
    data: EditorData;
    update: (d: EditorData) => void;
}

// Helper per endevinar l'emoji del títol (lògica interna, no cal traduir)
function getTitleEmoji(name: string): string {
    const n = name.toLowerCase();
    if (!n) return '✨';
    if (n.includes('pizza')) return '🍕';
    if (n.includes('pasta')) return '🍝';
    if (n.includes('burger') || n.includes('hamburg')) return '🍔';
    if (n.includes('amanida') || n.includes('ensalada') || n.includes('salad')) return '🥗';
    if (n.includes('postre') || n.includes('pastís') || n.includes('cake')) return '🍰';
    if (n.includes('sushi')) return '🍣';
    if (n.includes('arròs') || n.includes('paella') || n.includes('rice')) return '🥘';
    if (n.includes('taco')) return '🌮';
    return '🥘';
}

export function MetaControls({ data, update }: Props) {
  // ✅ 2. Agafem les traduccions
  const { t } = useLanguage();
  const labels = t.create_recipe.meta;
  const tagsDict = labels.tags;

  const titleEmoji = getTitleEmoji(data.name);

  // ✅ 3. Definim els tags DINS del component usant el diccionari
  const TAGS = [
    { id: 'vegan', label: tagsDict.vegan, emoji: '🌱' },
    { id: 'vegetarian', label: tagsDict.vegetarian, emoji: '🥗' },
    { id: 'gluten-free', label: tagsDict.gluten_free, emoji: '🌾' },
    { id: 'dairy-free', label: tagsDict.dairy_free, emoji: '🥛' },
    { id: 'quick', label: tagsDict.quick, emoji: '⚡' },
    { id: 'healthy', label: tagsDict.healthy, emoji: '💚' },
    { id: 'dessert', label: tagsDict.dessert, emoji: '🍰' },
  ];

  const toggleTag = (id: string) => {
    update({
        ...data,
        dietaryTags: data.dietaryTags.includes(id) 
            ? data.dietaryTags.filter(t => t !== id)
            : [...data.dietaryTags, id]
    });
  };

  return (
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-4xl p-6 shadow-2xl overflow-hidden group">
       
       {/* Fons Animats (Decoració) */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors duration-700" />

       <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
         
         {/* ESQUERRA: Títol Màgic */}
         <div className="flex-1 w-full lg:w-auto flex flex-col gap-4">
             <div className="flex items-start gap-4">
                {/* Emoji Gegant Animat */}
                <motion.div 
                    key={titleEmoji} 
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-inner border border-slate-700/50"
                >
                    {titleEmoji}
                </motion.div>

                <div className="flex-1 space-y-2">
                    <input 
                        value={data.name}
                        onChange={(e) => update({ ...data, name: e.target.value })}
                        // ✅ Placeholder traduït
                        placeholder={labels.placeholder_name}
                        className="bg-transparent text-2xl sm:text-4xl font-black text-white placeholder:text-slate-700 outline-none w-full leading-tight"
                    />
                    
                    {/* Control de Temps Divertit */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-slate-800 hover:border-purple-500/50 transition-colors cursor-pointer group/time">
                            <Clock size={18} className="text-purple-400 group-hover/time:animate-spin" />
                            <input 
                                type="number"
                                value={data.prepTimeMinutes}
                                onChange={(e) => update({ ...data, prepTimeMinutes: Number(e.target.value) })}
                                className="bg-transparent w-12 text-white font-mono font-bold outline-none text-right text-lg"
                            />
                            {/* ✅ Label traduït */}
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{labels.minutes_label}</span>
                        </div>
                        
                        {/* Slider Visual Ràpid */}
                        <div className="hidden sm:flex gap-1">
                            {[15, 30, 45, 60].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => update({ ...data, prepTimeMinutes: t })}
                                    className={`w-8 h-8 rounded-full text-[10px] font-bold border transition-all hover:scale-110 ${data.prepTimeMinutes === t ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/50' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
         </div>

         {/* DRETA: Tags com a "Badges" */}
         <div className="w-full lg:w-auto">
             {/* ✅ Títol traduït */}
             <p className="text-[10px] uppercase font-bold text-slate-500 mb-3 ml-1">{labels.tags_title}</p>
             <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => {
                    const isActive = data.dietaryTags.includes(tag.id);
                    return (
                        <motion.button
                            key={tag.id}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => toggleTag(tag.id)}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                                ${isActive 
                                    ? 'bg-linear-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg shadow-purple-900/50' 
                                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                                }
                            `}
                        >
                            <span>{tag.emoji}</span>
                            {tag.label}
                        </motion.button>
                    )
                })}
             </div>
         </div>
       </div>
    </div>
  );
}