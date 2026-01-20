// ARXIU: src/components/recipes/FilterBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  currentFilter: string;
  currentSearch: string;
  currentMode: string; // 'ALL' | 'MINE' | 'FAVORITES'
}

export function FilterBar({ currentFilter, currentSearch, currentMode = 'ALL' }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Actualitza paràmetres mantenint els altres
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') params.set(key, value);
    else params.delete(key);
    
    params.set('page', '1'); // Reset paginació
    router.push(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParam('q', term);
  }, 300);

  const handleModeChange = (mode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === 'ALL') params.delete('mode');
    else params.set('mode', mode);
    
    // Si canviem de mode, potser volem netejar els filtres de tags? 
    // De moment els mantenim per si vols buscar "Les meves receptes Veganes"
    
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const filters = [
    { id: 'ALL', label: t.community.filters.all, icon: '🌍' },
    { id: 'FAST', label: t.community.filters.fast, icon: '⚡' },
    { id: 'VEGGIE', label: t.community.filters.veggie, icon: '🥗' },
    { id: 'VEGAN', label: t.community.filters.vegan, icon: '🌱' },
    { id: 'GLUTEN_FREE', label: t.community.filters.gluten_free, icon: '🌾🚫' },
    { id: 'DAIRY_FREE', label: t.community.filters.dairy_free, icon: '🥛🚫' },
    { id: 'DESSERT', label: t.community.filters.dessert, icon: '🍰' },
  ];

  return (
    <div className="flex flex-col gap-4 sticky top-4 z-40">
        
      {/* 1. BARRA DE MODES (Pestanyes Superiors) */}
      <div className="flex p-1 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-800 w-full sm:w-fit self-start shadow-lg">
         <button 
            onClick={() => handleModeChange('ALL')}
            data-testid="recipe-mode-all"
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${currentMode === 'ALL' ? 'bg-slate-800 text-white shadow ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
         >
            🌍 Comunitat
         </button>
         <button 
            onClick={() => handleModeChange('FAVORITES')}
            data-testid="recipe-mode-favorites"
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${currentMode === 'FAVORITES' ? 'bg-slate-800 text-purple-400 shadow ring-1 ring-purple-900/50' : 'text-slate-500 hover:text-slate-300'}`}
         >
            ❤️ Favorits
         </button>
         <button 
            onClick={() => handleModeChange('MINE')}
            data-testid="recipe-mode-mine"
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${currentMode === 'MINE' ? 'bg-slate-800 text-emerald-400 shadow ring-1 ring-emerald-900/50' : 'text-slate-500 hover:text-slate-300'}`}
         >
            👨‍🍳 Les Meves
         </button>
      </div>

      {/* 2. BARRA DE FILTRES I CERCA (Això és el que faltava!) */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-900/80 backdrop-blur-xl p-2 pr-2 rounded-[2rem] border border-slate-800 shadow-xl">
         
         {/* LLISTA DE BOTONS (TAGS) */}
         <div className="flex p-1 w-full lg:w-auto overflow-x-auto no-scrollbar mask-linear-fade gap-1">
            {filters.map((f) => {
                const isActive = currentFilter === f.id || (f.id === 'ALL' && !currentFilter);
                return (
                    <button
                        key={f.id}
                        onClick={() => updateParam('filter', f.id)}
                        className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2
                            ${isActive ? 'bg-slate-100 text-slate-900 shadow-lg scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <span>{f.icon}</span>
                        {f.label}
                    </button>
                );
            })}
         </div>

         {/* INPUT DE CERCA */}
         <div className="relative w-full lg:w-auto min-w-[250px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-base grayscale opacity-50">🔍</div>
            <input 
                type="text" 
                placeholder={t.community.search_placeholder}
                defaultValue={currentSearch}
                onChange={(e) => handleSearch(e.target.value)}
                data-testid="recipe-search-input"
                className="w-full bg-black/40 border border-slate-700/50 rounded-full pl-10 pr-6 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
            />
         </div>
      </div>
    </div>
  );
}
