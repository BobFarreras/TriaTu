'use client';

import { Users, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { DecisionMetadata } from '@/core/domain/types/DecisionTypes';
import { safeParseMeta } from '../../logic/history-types';

// Tipus per evitar 'any' en les traduccions complexes
type ProfileTranslations = { 
    exclusions?: Record<string, string>; 
    food?: Record<string, string>; 
};

export const MagicStats = ({ metadata }: { metadata: DecisionMetadata | string | undefined | null }) => {
  const { t } = useLanguage(); 
  const meta = safeParseMeta(metadata); 
  
  const avoidedList = meta.avoidedAllergies || [];
  const hasAllergiesAvoided = avoidedList.length > 0;

  const translateAllergy = (allergyId: string) => {
    // Casting segur per accedir a claus dinàmiques del diccionari
    const profile = t.profile as unknown as ProfileTranslations;
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
