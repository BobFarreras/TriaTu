import { ScannedItem } from "@/core/domain/types/ScannedItem";

interface ScannedItemCardProps {
  item: ScannedItem;
  onUpdate: (field: keyof ScannedItem, value: string | number) => void;
  onRemove: () => void;
}

export function ScannedItemCard({ item, onUpdate, onRemove }: ScannedItemCardProps) {
  
  // ✅ LÒGICA VISUAL: Prioritat a la imatge del catàleg
  const hasMatch = !!item.productId;
  const displayImage = item.catalogImage; 
  const displayEmoji = item.emoji || "📦";

  return (
    <div className={`
        relative w-full rounded-xl p-3 border shadow-sm transition-all animate-in slide-in-from-right-4 duration-300
        ${hasMatch 
            ? 'bg-slate-900/80 border-emerald-500/30' // Verdós si hi ha match
            : 'bg-slate-900/90 border-slate-800'       // Gris si és genèric
        }
    `}>
        
        {/* 1. FILA SUPERIOR: IMATGE/EMOJI + NOM + ELIMINAR */}
        <div className="flex items-start gap-3 mb-3">
            
            {/* --- HERO IMAGE --- */}
            <div className="relative w-12 h-12 shrink-0">
               {displayImage ? (
                 <div className="w-full h-full bg-white rounded-lg p-1 flex items-center justify-center border border-slate-700 shadow-sm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={displayImage} alt="" className="w-full h-full object-contain" />
                 </div>
               ) : (
                 <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-2xl border border-slate-800">
                    {displayEmoji}
                 </div>
               )}

               {/* Badge Match */}
               {hasMatch && (
                 <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded shadow-sm border border-slate-900">
                   MATCH
                 </div>
               )}
            </div>
            
            {/* --- CAMPS DE TEXT --- */}
            <div className="flex-1 min-w-0">
                <input 
                    value={item.name}
                    onChange={(e) => onUpdate('name', e.target.value)}
                    className="w-full bg-transparent text-slate-200 font-bold text-sm border-none p-0 focus:ring-0 placeholder-slate-600 truncate mb-1"
                    placeholder="Nom del producte..."
                />
                
                {/* Preu o info extra */}
                {item.price && (
                   <div className="text-[10px] text-emerald-400 font-mono">
                      {item.price}€ / ut
                   </div>
                )}
            </div>
            
            <button 
                onClick={onRemove} 
                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-all shrink-0"
            >
                ✕
            </button>
        </div>

        {/* 2. FILA INFERIOR: CONTROLS */}
        <div className="flex items-center gap-2 w-full">
            
            {/* A. CÀPSULA QUANTITAT */}
            <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 h-8 shrink-0 overflow-hidden shadow-inner">
                <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => onUpdate('quantity', e.target.value)}
                    className="w-10 bg-transparent text-center text-white font-mono text-sm border-none focus:ring-0 p-0 h-full"
                />
                <div className="w-px h-1/2 bg-slate-800"></div>
                <select 
                    value={item.unit}
                    onChange={(e) => onUpdate('unit', e.target.value)}
                    className="bg-transparent text-slate-400 text-xs font-bold h-full border-none focus:ring-0 text-center pl-1 pr-3 cursor-pointer hover:text-white appearance-none"
                >
                    <option value="ut">ut</option>
                    <option value="kg">kg</option>
                    <option value="l">L</option>
                    <option value="g">g</option>
                </select>
            </div>

            {/* B. UBICACIÓ */}
            <div className="h-8 grow">
                <select 
                    value={item.location}
                    onChange={(e) => onUpdate('location', e.target.value)}
                    className="w-full h-full bg-slate-950 text-slate-300 text-[10px] font-bold uppercase rounded-lg border border-slate-800 focus:ring-0 cursor-pointer pl-2 appearance-none hover:border-slate-600 transition-colors"
                >
                    <option value="PANTRY">🥫 Rebost</option>
                    <option value="FRIDGE">❄️ Nevera</option>
                    <option value="FREEZER">🧊 Congelador</option>
                </select>
            </div>

            {/* C. DATA */}
            <div className="h-8 w-24 shrink-0">
                <input 
                    type="date"
                    value={item.expiryDate || ''}
                    onChange={(e) => onUpdate('expiryDate', e.target.value)}
                    className="w-full h-full bg-slate-950/50 rounded-lg border border-slate-800 px-2 text-slate-400 text-[10px] font-mono border-none focus:ring-0 text-center"
                />
            </div>

        </div>
    </div>
  );
}