import { ScannedItem } from "@/core/domain/types/ScannedItem";
// ❌ Esborra aquest import, ja no el necessitem aquí
// import { getEmojiForName } from "@/lib/presetMatcher"; 

interface ScannedItemCardProps {
  item: ScannedItem;
  onUpdate: (field: keyof ScannedItem, value: string | number) => void;
  onRemove: () => void;
}

export function ScannedItemCard({ item, onUpdate, onRemove }: ScannedItemCardProps) {
  
  // ✅ CORRECCIÓ: Usem l'emoji que ve de l'objecte (IA o Preset)
  // Si per algun motiu fos undefined, posem la caixa.
  const productEmoji = item.emoji || "📦";

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-slate-800 shadow-md relative animate-in slide-in-from-right-4 duration-300 w-full group hover:border-slate-700 transition-colors">
        
        {/* 1. FILA SUPERIOR: EMOJI + NOM + ELIMINAR */}
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-lg shadow-inner shrink-0 border border-slate-800">
                {/* Aquí es renderitza l'emoji bo */}
                {productEmoji}
            </div>
            
            <input 
                value={item.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className="flex-1 bg-transparent text-slate-200 font-bold text-sm border-none p-0 focus:ring-0 placeholder-slate-600 min-w-0"
                placeholder="Nom..."
            />
            
            <button 
                onClick={onRemove} 
                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-all shrink-0"
            >
                ✕
            </button>
        </div>

        {/* 2. FILA INFERIOR: TOTS ELS CONTROLS ALINEATS */}
        <div className="flex items-center gap-2 w-full">
            
            {/* A. CÀPSULA QUANTITAT + UNITAT */}
            <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 h-9 shrink-0 overflow-hidden">
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
                    className="bg-transparent text-slate-300 text-xs font-bold h-full border-none focus:ring-0 text-center pl-1 pr-1 cursor-pointer hover:text-white appearance-none min-w-14"
                >
                    <option value="ut">📦 ut</option>
                    <option value="kg">⚖️ kg</option>
                    <option value="l">💧 L</option>
                    <option value="g">🤏 g</option>
                </select>
            </div>

            {/* B. UBICACIÓ */}
            <div className="h-9 grow min-w-20">
                <select 
                    value={item.location}
                    onChange={(e) => onUpdate('location', e.target.value)}
                    className="w-full h-full bg-slate-950 text-slate-300 text-[10px] sm:text-xs font-bold uppercase rounded-lg border border-slate-800 focus:ring-0 cursor-pointer pl-2 pr-1 appearance-none hover:border-slate-600 transition-colors"
                >
                    <option value="FRIDGE">❄️ Nevera</option>
                    <option value="PANTRY">🥫 Rebost</option>
                    <option value="FREEZER">🧊 Congelador</option>
                </select>
            </div>

            {/* C. DATA */}
            <div className="h-9 shrink-0 w-24 sm:w-auto">
                <div className="w-full h-full flex items-center bg-slate-950/50 rounded-lg border border-slate-800/50 px-2">
                    <input 
                        type="date"
                        value={item.expiryDate || ''}
                        onChange={(e) => onUpdate('expiryDate', e.target.value)}
                        className="bg-transparent text-slate-400 text-[10px] font-mono border-none focus:ring-0 p-0 w-full text-right sm:text-center"
                    />
                </div>
            </div>

        </div>
    </div>
  );
}