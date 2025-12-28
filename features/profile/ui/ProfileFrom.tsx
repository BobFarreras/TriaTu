// =================== FILE: features/profile/ui/ProfileFrom.tsx ===================
'use client'

import { useActionState, useState, useMemo } from 'react';
import { updateProfileAction } from '@/app/actions/profile-actions';
import { TagInput } from '@/components/ui/TagInput';
import { SearchableSectionGrid } from '@/components/ui/SearchableSectionGrid';
import { EXCLUSION_DATA, FOOD_DATA } from '@/core/constants/profile-data';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Save, CheckCircle2 } from 'lucide-react';

type ProfileData = {
  foodPreferences: string[];
  exclusions: string[];
  socialTolerance: number;
};

// Helper per obtenir tots els IDs (per saber quins estan marcats inicialment)
const getAllIds = (categories: typeof EXCLUSION_DATA) =>
  categories.flatMap(c => c.items.map(i => i.id));

export function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const { t } = useLanguage();
  const [state, action, isPending] = useActionState(updateProfileAction, {});

  const knownFoodIds = getAllIds(FOOD_DATA);
  const knownExclusionIds = getAllIds(EXCLUSION_DATA);

  // ESTATS LOCALS
  const [selectedFood, setSelectedFood] = useState<string[]>(
    initialData.foodPreferences.filter(f => knownFoodIds.includes(f))
  );
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>(
    initialData.exclusions.filter(ex => knownExclusionIds.includes(ex))
  );
  const [tolerance, setTolerance] = useState(initialData.socialTolerance);

  // --- TRADUCCIÓ DE DADES (FIX: SENSE 'ANY') ---
  // Utilitzem 'Record<string, string>' per dir-li a TS que podem accedir amb strings dinàmics
  
  const translatedFoodData = useMemo(() => {
    // Casting segur: Tractem l'objecte de traduccions com un diccionari
    const dict = (t.profile?.food || {}) as Record<string, string>;
    
    return FOOD_DATA.map(cat => ({
        // Si no troba la traducció, fa fallback a l'ID o títol original
        title: dict[cat.id] || cat.id, 
        items: cat.items.map(item => ({
            id: item.id,
            emoji: item.emoji,
            label: dict[item.id] || item.id
        }))
    }));
  }, [t]);

  const translatedExclusionData = useMemo(() => {
    const dict = (t.profile?.exclusions || {}) as Record<string, string>;
    
    return EXCLUSION_DATA.map(cat => ({
        title: dict[cat.id] || cat.id,
        items: cat.items.map(item => ({
            id: item.id,
            emoji: item.emoji,
            label: dict[item.id] || item.id
        }))
    }));
  }, [t]);

  return (
    <form action={action} className="space-y-6 pb-24">
      
      {/* --- CARD 1: MENJAR (VERD) --- */}
      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] border-4 border-green-100 dark:border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-green-300 dark:hover:border-green-900/50 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
          
          <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center text-2xl animate-bounce-click">
                  😋
              </div>
              <div>
                  <h2 className="text-xl font-black text-gray-800 dark:text-white leading-none">
                      {t.profile?.menu_title || 'Menú Preferit'}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">
                      {t.profile?.menu_desc || 'Què t\'agrada?'}
                  </p>
              </div>
          </div>

          <SearchableSectionGrid
            data={translatedFoodData}
            selectedValues={selectedFood}
            onChange={setSelectedFood}
            placeholder={t.profile?.search_food || "Buscar..."}
            accentColor="green"
          />
          <input type="hidden" name="foodPreferences" value={selectedFood.join(',')} />
      </div>

      {/* --- CARD 2: EXCLUSIONS (VERMELL) --- */}
      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] border-4 border-red-100 dark:border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-red-300 dark:hover:border-red-900/50 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 to-orange-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

          <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center text-2xl animate-pulse">
                  🚫
              </div>
              <div>
                  <h2 className="text-xl font-black text-gray-800 dark:text-white leading-none">
                      {t.profile?.blacklist_title || 'Exclusions'}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">
                      {t.profile?.blacklist_desc || 'Prohibit entrar'}
                  </p>
              </div>
          </div>

          <SearchableSectionGrid
            data={translatedExclusionData}
            selectedValues={selectedExclusions}
            onChange={setSelectedExclusions}
            placeholder={t.profile?.search_allergy || "Buscar..."}
            accentColor="red"
          />
          <input type="hidden" name="exclusions_base" value={selectedExclusions.join(',')} />

          {/* Sub-secció Extres */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 dark:border-zinc-800">
             <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-black bg-orange-100 text-orange-700 px-2 py-1 rounded-md uppercase tracking-wider">Extra</span>
                <span className="text-sm font-bold text-gray-500">{t.profile?.warning_title || 'T\'has deixat alguna cosa?'}</span>
             </div>
             <TagInput
                label=""
                name="exclusions_extra"
                placeholder={t.profile?.warning_placeholder || "Escriu i prem Enter"}
                defaultValue={initialData.exclusions.filter(ex => !knownExclusionIds.includes(ex))}
             />
          </div>
      </div>

      {/* --- CARD 3: TOLERÀNCIA (BLAU) --- */}
      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] border-4 border-blue-100 dark:border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-900/50 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-cyan-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

          <div className="flex flex-col items-center text-center">
              <span className="text-5xl mb-4 transition-transform hover:scale-125 cursor-help select-none">
                  {tolerance <= 3 ? '😤' : tolerance >= 8 ? '😇' : '😐'}
              </span>
              <h2 className="text-xl font-black text-gray-800 dark:text-white mb-1">
                  {t.profile?.flexibility_title || 'Nivell de Flexibilitat'}
              </h2>
              <p className="text-blue-500 font-black text-3xl mb-6">{tolerance}/10</p>

              <div className="w-full max-w-sm relative h-12 flex items-center">
                  <div className="absolute w-full h-4 bg-gray-200 dark:bg-black rounded-full overflow-hidden">
                      <div 
                          className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-300"
                          style={{ width: `${tolerance * 10}%` }}
                      />
                  </div>
                  <input 
                      type="range" 
                      name="socialTolerance"
                      min="1" 
                      max="10" 
                      value={tolerance}
                      onChange={(e) => setTolerance(Number(e.target.value))}
                      className="absolute w-full h-12 opacity-0 cursor-pointer z-10"
                  />
                  <div 
                      className="absolute h-8 w-8 bg-white border-4 border-blue-500 rounded-full shadow-lg pointer-events-none transition-all duration-200"
                      style={{ left: `calc(${tolerance * 10}% - 16px)` }}
                  ></div>
              </div>
              
              <div className="flex justify-between w-full max-w-sm text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                  <span>{t.profile?.rigid || 'RÍGID'}</span>
                  <span>{t.profile?.flexible || 'FLEXIBLE'}</span>
              </div>
          </div>
      </div>

      {/* --- BOTÓ FLOTANT (FAB) --- */}
      {/* Centrat, amb blur de fons i animació d'entrada */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-20 fade-in duration-700">
         <button 
            type="submit" 
            disabled={isPending}
            className={`
                group flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl transition-all duration-300 border border-white/10 backdrop-blur-md
                ${state.success 
                    ? 'bg-green-500 text-white hover:bg-green-600 scale-105' 
                    : 'bg-black/90 dark:bg-white/90 text-white dark:text-black hover:scale-105 hover:-translate-y-1'
                }
            `}
         >
            {isPending ? (
                <span className="animate-spin text-lg">⏳</span>
            ) : state.success ? (
                <CheckCircle2 size={20} className="animate-bounce" />
            ) : (
                <Save size={20} className="group-hover:rotate-12 transition-transform" />
            )}
            
            <span className="font-black text-sm md:text-base tracking-wide whitespace-nowrap">
                {state.success ? (t.profile?.saved || 'GUARDAT!') : (t.profile?.save_btn || 'GUARDAR CANVIS')}
            </span>
         </button>
      </div>

    </form>
  );
}