// =================== FILE: components/ui/SearchableSectionGrid.tsx ===================

'use client'

import { useState, useMemo } from 'react';
import { OptionCategory } from '@/core/constants/profile-data';
import { Search, ChevronDown } from 'lucide-react';

interface Props {
  data: OptionCategory[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  placeholder?: string;
  accentColor?: 'green' | 'red' | 'blue';
}

export function SearchableSectionGrid({ data, selectedValues, onChange, placeholder, accentColor = 'green' }: Props) {
  const [query, setQuery] = useState('');
  
  const [manuallyOpenSections, setManuallyOpenSections] = useState<Set<string>>(
    new Set([data[0]?.title])
  ); 

  const activeClasses = {
    green: 'border-green-600 bg-green-500 text-white shadow-green-200 dark:shadow-none ring-green-300',
    red: 'border-red-600 bg-red-500 text-white shadow-red-200 dark:shadow-none ring-red-300',
    blue: 'border-blue-600 bg-blue-500 text-white shadow-blue-200 dark:shadow-none ring-blue-300',
  };

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const lowerQuery = query.toLowerCase();
    return data
      .map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.label.toLowerCase().includes(lowerQuery) || 
          item.emoji.includes(query)
        )
      }))
      .filter(category => category.items.length > 0);
  }, [data, query]);

  const isSearching = query.trim().length > 0;

  const toggleSection = (title: string) => {
    if (isSearching) return;
    const newOpen = new Set(manuallyOpenSections);
    if (newOpen.has(title)) newOpen.delete(title);
    else newOpen.add(title);
    setManuallyOpenSections(newOpen);
  };

  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(v => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* BUSCADOR STICKY (Amb efecte glassmorphism millorat) */}
      <div className="sticky top-4 z-30 pointer-events-none">
        <div className="relative group pointer-events-auto">
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 rounded-2xl blur-xl transform scale-90 translate-y-2"></div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors z-10" size={20} />
          <input 
            type="text" 
            className="relative w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl focus:border-black dark:focus:border-white focus:outline-none transition-all shadow-xl shadow-gray-200/40 dark:shadow-none font-bold text-lg"
            placeholder={placeholder || "Buscar..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((category) => {
            const isOpen = isSearching || manuallyOpenSections.has(category.title);
            const selectedCount = category.items.filter(i => selectedValues.includes(i.id)).length;

            return (
              <div key={category.title} className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 dark:hover:border-zinc-700">
                <button
                  type="button"
                  onClick={() => toggleSection(category.title)}
                  disabled={isSearching}
                  className={`w-full flex items-center justify-between p-5 text-left transition-all ${isSearching ? 'cursor-default' : 'hover:bg-white/50 dark:hover:bg-zinc-800/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-gray-700 dark:text-gray-200 text-lg md:text-xl tracking-tight">{category.title}</span>
                    {selectedCount > 0 && (
                      <span className={`animate-bounce-click text-xs font-black px-2 py-1 rounded-full text-white shadow-sm transform scale-100 transition-transform ${accentColor === 'red' ? 'bg-red-500' : 'bg-green-500'}`}>
                        {selectedCount}
                      </span>
                    )}
                  </div>
                  {!isSearching && (
                    <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gray-200 dark:bg-zinc-700' : 'bg-transparent'}`}>
                      <ChevronDown size={20} />
                    </div>
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {category.items.map((item, index) => {
                        const isSelected = selectedValues.includes(item.id);
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleOption(item.id)}
                            // AFEGIM: style={{ animationDelay }} per l'efecte cascada "pop"
                            style={{ animationDelay: `${index * 30}ms` }} 
                            className={`
                              animate-in fade-in zoom-in-50 fill-mode-backwards duration-300
                              relative flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-b-4 transition-all h-28 group
                              ${isSelected 
                                ? `${activeClasses[accentColor]} border-b-0 translate-y-1 scale-[0.98]` 
                                : 'border-gray-200 border-b-gray-300 bg-white hover:bg-white hover:-translate-y-1 hover:border-b-[6px] hover:shadow-lg dark:bg-zinc-800 dark:border-zinc-700 dark:border-b-zinc-950'
                              }
                            `}
                          >
                            <span className="text-4xl mb-1 filter drop-shadow-sm select-none transform transition-transform group-hover:scale-110 group-active:scale-90 duration-200">
                              {item.emoji}
                            </span>
                            <span className={`text-xs font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                              {item.label}
                            </span>
                            
                            {/* Checkmark animat */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 text-white animate-in zoom-in duration-200 font-black">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
             {/* Empty State divertit */}
             <div className="inline-block text-6xl mb-4 animate-float">🦗</div>
             <p className="font-bold text-gray-500">Res per aquí...</p>
          </div>
        )}
      </div>
    </div>
  );
}