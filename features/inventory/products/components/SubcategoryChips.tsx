import { MainCategory } from '@/lib/taxonamy'; // Make sure this import is correct (taxonomy, not taxonamy)
import { useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  category: MainCategory;
  activeQuery: string | string[]; // ✅ Updated type to match the new definition
  onSelect: (query: string | string[]) => void; // ✅ Updated type for the callback
}

export function SubcategoryChips({ category, activeQuery, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto-scroll to selected chip
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeQuery]);

  return (
    <div ref={containerRef} className="flex gap-2">
      {category.subcategories.map((sub) => {
        // ✅ Comparison logic for complex types (string vs array)
        // Since we are setting activeQuery directly from sub.query on click,
        // strict reference equality (===) might work if reference is preserved,
        // but robust comparison is safer for arrays.
        
        let isActive = false;
        
        if (Array.isArray(sub.query) && Array.isArray(activeQuery)) {
            // If both are arrays, simple JSON stringify comparison is usually enough for this use case
            // or checking if length and first element match.
            isActive = JSON.stringify(sub.query) === JSON.stringify(activeQuery);
        } else {
            // String comparison
            isActive = sub.query === activeQuery;
        }
        
        return (
          <button
            key={sub.id}
            data-active={isActive}
            onClick={() => onSelect(sub.query)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 shrink-0
              ${isActive 
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105 z-10' 
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200' 
              }
            `}
          >
            <span className="text-base">{sub.emoji}</span>
            <span className="uppercase tracking-wide">{t.taxonomy.subcategories[sub.id as keyof typeof t.taxonomy.subcategories] ?? sub.label}</span>
          </button>
        );
      })}
    </div>
  );
}
