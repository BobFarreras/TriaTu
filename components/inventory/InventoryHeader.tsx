import { BackButton } from '@/components/ui/BackButton';

export function InventoryHeader({ totalItems }: { totalItems: number }) {
  return (
    // HEADER PRINCIPAL: Flex row per separar Esquerra (Botó+Títol) de Dreta (Badge)
    <header className="mb-6 flex flex-row items-center justify-between gap-3 sm:gap-4 border-b border-slate-800 pb-6">
      
      {/* --- GRUP ESQUERRA: Botó Enrere + Textos --- */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* 1. Botó Enrere (Forcem /dashboard o l'arrel) */}
        <div className="shrink-0">
            <BackButton href="/dashboard" className="h-10" />
        </div>

        {/* 2. Títols */}
        <div className="flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
              Revost <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">Digital</span>
            </h1>
            {/* El subtítol l'amaguem en mòbils molt petits per netejar la vista */}
            <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">
              Control d'estoc i caducitats
            </p>
        </div>
      </div>

      {/* --- GRUP DRETA: Badge Total --- */}
      <div className="text-right shrink-0">
         <div className="flex flex-col items-end">
             <span className="text-[10px] sm:text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 whitespace-nowrap shadow-inner">
               <span className="hidden sm:inline opacity-70 mr-1">ITEMS:</span> 
               <span className="text-purple-400 font-bold text-sm">{totalItems}</span>
             </span>
         </div>
      </div>
      
    </header>
  );
}