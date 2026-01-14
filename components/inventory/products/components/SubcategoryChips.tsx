import { MainCategory } from '@/lib/food-categories';
import { useRef, useEffect } from 'react';

interface Props {
  category: MainCategory;
  activeQuery: string;
  onSelect: (query: string) => void;
}

export function SubcategoryChips({ category, activeQuery, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al xip seleccionat
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeQuery]);

  return (
    <div ref={containerRef} className="flex gap-2">
      {category.subcategories.map((sub) => {
        const isActive = activeQuery === sub.query;
        
        return (
          <button
            key={sub.id}
            data-active={isActive}
            onClick={() => onSelect(sub.query)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 shrink-0
              ${isActive 
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105 z-10' // Seleccionat: Blanc brillant i gran
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200' // Altres: Foscos i apagats
              }
            `}
          >
            <span className="text-base">{sub.emoji}</span>
            <span className="uppercase tracking-wide">{sub.label}</span>
          </button>
        );
      })}
    </div>
  );
}