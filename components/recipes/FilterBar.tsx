'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { motion } from 'framer-motion';

export function FilterBar({ currentFilter, currentSearch }: { currentFilter: string, currentSearch: string }) {
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

  // Afegeix aquí els filtres que vulguis.
  // L'ID ('VEGAN', 'DESSERT') és el que enviarem per URL.
  const filters = [
    { id: 'ALL', label: 'Totes', icon: '🌍' },
    { id: 'FAST', label: 'Ràpides', icon: '⚡' },
    { id: 'VEGGIE', label: 'Vegetarià', icon: '🥗' },
    { id: 'VEGAN', label: 'Vegà', icon: '🌱' },
    { id: 'GLUTEN_FREE', label: 'Sense Gluten', icon: '🌾🚫' },
    { id: 'DAIRY_FREE', label: 'Sense Lactosa', icon: '🥛🚫' },
    { id: 'DESSERT', label: 'Postres', icon: '🍰' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center bg-slate-900/80 backdrop-blur-xl p-2 pr-4 rounded-[2rem] border border-slate-800 shadow-xl sticky top-4 z-40">
      
      {/* 🔮 FILTRES ANIMATS (Scrollable) */}
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
      
      {/* 🔍 CERCA ESTILITZADA */}
      <div className="relative w-full lg:w-auto min-w-[300px] group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-lg">
            🔍
        </div>
        <input 
          type="text" 
          placeholder="Cercar ingredients..." 
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-black/40 border border-slate-800 rounded-full pl-12 pr-6 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}