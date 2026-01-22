// features/rooms/components/drawer/FeatureToggleCard.tsx
import { FeatureToggleCardProps } from "./types";

export function FeatureToggleCard({ icon, label, description, isActive, onClick, disabled, activeColor }: FeatureToggleCardProps) {
  return (
    <button 
      onClick={(e) => {
        e.preventDefault(); // Prevé comportaments estranys
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      type="button" // Importantíssim per no fer submit si està dins un form
      className={`
        w-full flex items-center justify-between p-4 rounded-3xl border transition-all text-left group
        ${isActive ? 'bg-zinc-900 border-zinc-700 shadow-inner' : 'bg-zinc-900/40 border-zinc-800/50 opacity-70'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99] hover:bg-zinc-900 hover:border-zinc-700'}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl transition-colors ${isActive ? 'bg-zinc-800' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
          {icon}
        </div>
        <div>
          <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
            {label}
          </div>
          <div className="text-[10px] text-zinc-500 font-medium">
            {description}
          </div>
        </div>
      </div>
      
     {/* SWITCH VISUAL */}
      <div className={`
        relative w-12 h-7 rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4
        ${isActive ? activeColor : 'bg-zinc-700'}
      `}>
        <div className={`
          absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
          ${isActive ? 'translate-x-6' : 'translate-x-1'}
        `} />
      </div>
    </button>
  );
}