'use client'

import { useState, useMemo } from 'react';
import { OptionCategory } from '@/core/constants/profile-data';
import { Search } from 'lucide-react';

interface Props {
  data: OptionCategory[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  placeholder?: string;
}

export function SearchableSectionGrid({ data, selectedValues, onChange, placeholder }: Props) {
  const [query, setQuery] = useState('');

  // Lògica de filtratge (useMemo per rendiment)
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;

    const lowerQuery = query.toLowerCase();

    return data
      .map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.label.toLowerCase().includes(lowerQuery) || 
          item.emoji.includes(query) // Permet buscar per emoji també!
        )
      }))
      .filter(category => category.items.length > 0); // Eliminem categories buides
  }, [data, query]);

  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(v => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* BUSCADOR */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
          placeholder={placeholder || "Buscar..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* GRID DE RESULTATS */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {filteredData.length > 0 ? (
          filteredData.map((category) => (
            <div key={category.title}>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">
                {category.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {category.items.map((item) => {
                  const isSelected = selectedValues.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleOption(item.id)}
                      className={`
                        flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border transition-all duration-200 h-28
                        ${isSelected 
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black scale-95 shadow-lg' 
                          : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-600'
                        }
                      `}
                    >
                      <span className="text-4xl mb-1 filter drop-shadow-sm">{item.emoji}</span>
                      <span className="text-xs font-semibold text-center leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 italic">
            No s'han trobat resultats per "{query}". 
            <br />
            Prova d'escriure-ho al camp "Altres".
          </div>
        )}
      </div>
    </div>
  );
}