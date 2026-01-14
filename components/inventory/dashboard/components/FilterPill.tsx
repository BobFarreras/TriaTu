'use client';

interface FilterPillProps {
  label: string;
  icon: string;
  count: number;
  activeClass: string;
  isActive: boolean;
  onClick: () => void;
  // ✅ NOVA PROP OPCIONAL: Per canviar el color del comptador quan està actiu
  badgeActiveClass?: string; 
}

export function FilterPill({ 
  label, 
  icon, 
  count, 
  activeClass, 
  isActive, 
  onClick,
  badgeActiveClass = 'bg-white/20 text-white' // Valor per defecte (translucid)
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-0.5 sm:gap-2 
        px-1 py-2 sm:px-3 sm:py-2 
        rounded-xl border transition-all w-full
        ${isActive 
          ? `${activeClass} shadow-md scale-[1.02]` 
          : `bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800`
        }
      `}
    >
      <div className="flex items-center gap-1">
        <span className="text-lg sm:text-xl leading-none filter drop-shadow-sm">{icon}</span>
        {/* Text visible només en pantalles grans */}
        <span className="text-[10px] uppercase tracking-wider font-bold hidden sm:block">
          {label}
        </span>
      </div>
      
      {/* Comptador */}
      <span className={`
         text-[10px] sm:text-xs font-mono px-1.5 py-0.5 rounded-md leading-none font-bold
         ${isActive ? badgeActiveClass : 'bg-slate-800 text-slate-500'}
      `}>
         {count}
      </span>
    </button>
  );
}