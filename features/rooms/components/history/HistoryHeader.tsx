'use client';
import { ChevronDown, ChefHat, Sparkles, Dices, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { HistoryItem, safeParseMeta } from '../../logic/history-types';

export const HistoryHeader = ({ item, isOpen, toggle }: { item: HistoryItem; isOpen: boolean; toggle: () => void; }) => {
  const { t } = useLanguage();
  const meta = safeParseMeta(item.metadata);
  
  const isRecipe = !!meta.recipeId;
  const isMagic = (typeof meta.matchPercentage === 'number') || meta.isSafe; 
  const timeString = new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let Icon = Dices;
  let bgGradient = 'bg-gradient-to-br from-zinc-600 to-zinc-800';

  if (isRecipe) {
    Icon = ChefHat;
    bgGradient = 'bg-gradient-to-br from-emerald-600 to-teal-800';
  } else if (isMagic) {
    Icon = Sparkles;
    bgGradient = 'bg-gradient-to-br from-violet-600 to-indigo-800';
  }

  return (
    <div onClick={toggle} className="p-5 cursor-pointer flex gap-4 relative z-10 items-start">
      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white border-2 border-white/10 shadow-inner ${bgGradient}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-start gap-4">
           <h4 className="font-black text-xl text-white leading-tight wrap-break-word">{item.choice}</h4>
           <div className={`text-zinc-500 transition-transform duration-300 mt-1 shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`}><ChevronDown size={20} /></div>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs font-bold text-zinc-500 uppercase tracking-wide">
           <span className="flex items-center gap-1 bg-zinc-950/50 px-2 py-0.5 rounded-md"><Clock size={10} /> {timeString}</span>
           {isMagic && (
               <span className={isRecipe ? "text-emerald-500/80" : "text-violet-500/80"}>
                  {isRecipe ? t.room.history.type_recipe : t.room.history.type_algo}
               </span>
           )}
        </div>
      </div>
    </div>
  );
};
