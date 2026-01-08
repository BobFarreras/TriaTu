'use client';

import { useState } from 'react';
import { ChevronDown, Trophy, Sparkles, BrainCircuit, Users, ShieldCheck, ChefHat, Clock, Dices } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DecisionMetadata } from '@/core/domain/types/DecisionTypes';

// ✅ 1. DEFINIM EL TIPUS EXTÈS
interface DecisionMetaExtended extends DecisionMetadata {
  recipeId?: string;
  matchPercentage?: number;
  matchCount?: number;
  isManual?: boolean;
  isSafe?: boolean;
  avoidedAllergies?: string[];
}

export interface HistoryItem {
  choice: string;
  reason: string;
  date: string;
  metadata?: DecisionMetadata | string; 
}

// ✅ 2. HELPER CRÍTIC SENSE 'ANY'
// Usem 'unknown' que és la forma segura. TS ens obliga a comprovar el tipus abans d'usar-lo.
const safeParseMeta = (rawMeta: unknown): DecisionMetaExtended => {
  if (!rawMeta) return {};

  if (typeof rawMeta === 'string') {
    try {
      return JSON.parse(rawMeta) as DecisionMetaExtended;
    } catch (e) {
      console.error("Error parsing metadata JSON:", e);
      return {};
    }
  }
  
  // Si no és string ni null, assumim que ja és l'objecte correcte
  return rawMeta as DecisionMetaExtended;
};

// ------------------------------------------------------------------
// SUB-COMPONENT 1: HEADER
// ------------------------------------------------------------------
const HistoryHeader = ({ item, isOpen, toggle }: { item: HistoryItem; isOpen: boolean; toggle: () => void; }) => {
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
           {!isMagic && (
               <span className="text-zinc-600">{t.room.history.type_manual}</span>
           )}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// SUB-COMPONENT 2: STATS (SENSE 'ANY')
// ------------------------------------------------------------------
// Definim explícitament què pot ser metadata
const MagicStats = ({ metadata }: { metadata: DecisionMetadata | string | undefined | null }) => {
  const { t } = useLanguage(); 
  const meta = safeParseMeta(metadata); // El parser ja gestiona els tipus
  
  const avoidedList = meta.avoidedAllergies || [];
  const hasAllergiesAvoided = avoidedList.length > 0;

  const translateAllergy = (allergyId: string) => {
    type ProfileData = { exclusions?: Record<string, string>; food?: Record<string, string>; };
    const profile = t.profile as unknown as ProfileData;
    const key = allergyId.toLowerCase();
    
    if (profile.exclusions?.[key]) return profile.exclusions[key];
    if (profile.food?.[key]) return profile.food[key];
    return allergyId;
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
       <div className="bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50 text-center">
         <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-green-400 mb-1">
           <Users size={12} /> {t.room.history.match}
         </div>
         <p className="text-2xl font-black text-white">
           {meta.matchPercentage || 95}<span className="text-sm text-zinc-500">%</span>
         </p>
       </div>
       <div className="bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50 text-center flex flex-col justify-center">
         <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-blue-400 mb-2">
           <ShieldCheck size={12} /> {t.room.history.allergies}
         </div>
         {hasAllergiesAvoided ? (
            <div className="flex flex-wrap justify-center gap-1">
                {avoidedList.map((allergy, i) => (
                    <span key={i} className="text-[10px] bg-red-500/20 text-red-200 px-2 py-1 rounded-md border border-red-500/30 uppercase font-bold flex items-center gap-1">
                        🚫 {translateAllergy(allergy)}
                    </span>
                ))}
            </div>
         ) : (
            <span className="text-xs font-bold text-zinc-400 bg-zinc-900/50 py-1 px-2 rounded-lg inline-block">
               ✅ {t.room.history.safe}
            </span>
         )}
       </div>
    </div>
  );
};

// ------------------------------------------------------------------
// SUB-COMPONENT 3: DETAILS
// ------------------------------------------------------------------
const HistoryDetails = ({ item }: { item: HistoryItem }) => {
  const { t } = useLanguage(); 
  const meta = safeParseMeta(item.metadata);
  
  const isMagic = (typeof meta.matchPercentage === 'number') || meta.isSafe;
  const isRecipe = !!meta.recipeId;

  const getDynamicReason = () => {
    if (meta.isManual) return t.room.history.manual_reason;
    if (meta.isSafe || (meta.matchCount === 0)) return t.room.history.magic_safe;
    if (typeof meta.matchCount === 'number' && meta.matchCount > 0) {
      return t.room.history.magic_match.replace('{count}', meta.matchCount.toString());
    }
    return item.reason;
  };

  return (
    <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-800/50 mb-4">
         <div className="flex gap-3 text-zinc-300">
            <BrainCircuit size={20} className="text-purple-400 shrink-0 mt-0.5" />
            <p className="italic text-sm leading-relaxed text-zinc-300">
               "{getDynamicReason()}"
            </p>
         </div>
      </div>

      {isMagic && <MagicStats metadata={item.metadata} />}

      {isRecipe && meta.recipeId && (
        <Link href={`/recipes/${meta.recipeId}`} className="block group/btn">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transition-all group-hover/btn:scale-[1.02]">
                <ChefHat size={20} />
                <span className="text-sm">{t.room.history.view_recipe}</span>
            </Button>
        </Link>
      )}
    </div>
  );
};

// ... (El resta del fitxer igual) ...
function HistoryItemCard({ item, index }: { item: HistoryItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="group relative bg-zinc-900/90 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-0.5" style={{ animationDelay: `${index * 100}ms` }}>
      <HistoryHeader item={item} isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      {isOpen && <HistoryDetails item={item} />}
    </div>
  );
}

export function HistoryList({ history }: { history: HistoryItem[] }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleHistory = isExpanded ? history : history.slice(0, 3);
  const remainingCount = Math.max(0, history.length - 3);

  const showMoreText = t.room.history.show_more.replace('{count}', remainingCount.toString());

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-zinc-900/30 rounded-4xl border-2 border-dashed border-zinc-800/50">
        <div className="text-5xl mb-4 grayscale opacity-30">🏆</div>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{t.room.history.empty}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-2 shadow-2xl">
      <div className="px-6 py-5 flex justify-between items-center">
        <h3 className="font-black text-sm uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Trophy size={16} className="text-yellow-600" /> {t.room.history.title}</h3>
        <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold">{history.length}</span>
      </div>
      <div className="px-2 pb-2 space-y-3">
        {visibleHistory.map((item, index) => (<HistoryItemCard key={`${item.date}-${index}`} item={item} index={index} />))}
        {!isExpanded && remainingCount > 0 && (
          <button onClick={() => setIsExpanded(true)} className="w-full py-4 text-xs font-black text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all border border-dashed border-zinc-800 hover:border-zinc-600">{showMoreText}</button>
        )}
      </div>
    </div>
  );
}