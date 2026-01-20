'use client';

interface Props {
  onDelete: () => void;
  onConsume: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export function EditModalActions({ onDelete, onConsume, onSave, isSaving }: Props) {
  return (
    // ✅ CANVI: Padding inferior reduït a pb-4 (o pb-6 per safe area)
    <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 shrink-0 pb-6">
       
       <button 
         onClick={onDelete}
         className="w-14 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl hover:bg-red-900/20 hover:text-red-400 text-slate-500 transition-all active:scale-95"
       >
         <span className="text-xl">🗑️</span>
       </button>

       <button 
         onClick={onConsume}
         disabled={isSaving}
         className="flex-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold py-3 rounded-xl transition-all flex flex-col items-center justify-center leading-none gap-0.5 active:scale-[0.98]"
       >
         <span className="text-lg">🍽️</span>
         <span className="text-[9px] uppercase tracking-wide opacity-80">Consumir 1</span>
       </button>

       <button 
         onClick={onSave}
         disabled={isSaving}
         className="flex-[1.5] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] flex flex-col items-center justify-center leading-none gap-0.5"
       >
         <span className="text-lg">💾</span>
         <span className="text-[9px] uppercase tracking-wide opacity-90">Guardar</span>
       </button>
    </div>
  );
}