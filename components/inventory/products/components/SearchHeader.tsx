import { MainCategory } from '@/lib/food-categories';

interface Props {
  activeCategory: MainCategory | null;
  manualSearch: string;
  onManualInput: (text: string) => void;
  onReset: () => void;
}

export function SearchHeader({ activeCategory, manualSearch, onManualInput, onReset }: Props) {
  return (
    <div className="p-4 bg-slate-900 border-b border-slate-800 flex gap-3 shrink-0">
      {activeCategory && (
        <button 
          onClick={onReset}
          className="px-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors font-bold text-lg"
        >
          ↩
        </button>
      )}
      <div className="relative flex-1">
        <input
          type="text"
          value={manualSearch}
          onChange={(e) => onManualInput(e.target.value)}
          placeholder={activeCategory ? `Buscant a ${activeCategory.label}...` : "Què vols afegir avui?"}
          className="w-full p-3 pl-11 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-inner"
        />
        <span className="absolute left-3.5 top-3.5 text-slate-400 text-lg">🔎</span>
      </div>
    </div>
  );
}