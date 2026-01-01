'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // ✅ Hook

export function FilterBar({ currentFilter, currentSearch }: { currentFilter: string, currentSearch: string }) {
  const { t } = useLanguage(); // ✅
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParam('q', term);
  }, 300);

  // ✅ Traduïm els labels fent servir el 't'
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
    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center bg-slate-900/80 backdrop-blur-xl p-2 pr-4 rounded-[2rem] border border-slate-800 shadow-xl sticky top-4 z-40">
      
      {/* FILTRES ANIMATS */}
      <div className="flex p-1 bg-black/20 rounded-full overflow-x-auto max-w-full no-scrollbar mask-linear-fade">
        {filters.map((f) => {
          const isActive = currentFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => updateParam('filter', f.id)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-colors whitespace-nowrap z-10 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full -z-10 shadow-lg shadow-purple-500/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="mr-2">{f.icon}</span>
              {f.label}
            </button>
          );
        })}
      </div>
      
      {/* CERCA */}
      <div className="relative w-full lg:w-auto min-w-[300px] group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-lg">
            🔍
        </div>
        <input 
          type="text" 
          placeholder={t.community.search_placeholder} // ✅ Traduït
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-black/40 border border-slate-800 rounded-full pl-12 pr-6 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}