// src/components/scanner/ScannedItemCard.tsx
import { ScannedItem } from "@/core/domain/types/ScannedItem";
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { getEmojiForName } from "@/lib/presetMatcher";

interface ScannedItemCardProps {
  item: ScannedItem;
  onUpdate: (field: keyof ScannedItem, value: string | number) => void;
  onRemove: () => void;
}

export function ScannedItemCard({ item, onUpdate, onRemove }: ScannedItemCardProps) {
  
  // Emoji automàtic pel nom (Ex: "Poma" -> 🍎)
  const productEmoji = getEmojiForName(item.name);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-800 shadow-lg relative animate-in slide-in-from-right-4 duration-300">
        
        {/* 1. CAPÇALERA: EMOJI + NOM + ELIMINAR */}
        <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner shrink-0 border border-slate-700">
                {productEmoji}
            </div>
            <input 
                value={item.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className="flex-1 bg-transparent text-white font-bold text-lg border-none p-0 focus:ring-0 placeholder-slate-600 min-w-0"
                placeholder="Nom del producte..."
            />
            <button 
                onClick={onRemove} 
                className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
            >
                ✕
            </button>
        </div>

        {/* 2. GRID DE PROPIETATS */}
        <div className="grid grid-cols-7 gap-2 mb-3">
            
            {/* Quantitat (Col 2/7) */}
            <div className="col-span-2 bg-slate-950 rounded-lg p-1 border border-slate-800 flex items-center">
                <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => onUpdate('quantity', e.target.value)}
                    className="w-full bg-transparent text-center text-white font-mono text-lg border-none focus:ring-0 p-0"
                />
            </div>

            {/* Unitats (Col 2/7) - AMB EMOJIS */}
            <div className="col-span-2">
                <select 
                    value={item.unit}
                    onChange={(e) => onUpdate('unit', e.target.value)}
                    className="w-full h-full bg-slate-950 text-white text-sm rounded-lg border-slate-800 focus:ring-0 text-center appearance-none"
                >
                    <option value="ut">📦 ut</option>
                    <option value="kg">⚖️ kg</option>
                    <option value="l">💧 l</option>
                    <option value="g">🤏 g</option>
                </select>
            </div>

            {/* Ubicació (Col 3/7) */}
            <div className="col-span-3">
                <select 
                    value={item.location}
                    onChange={(e) => onUpdate('location', e.target.value)}
                    className="w-full h-full bg-slate-950 text-white text-xs font-bold uppercase rounded-lg border-slate-800 focus:ring-0"
                >
                    <option value="FRIDGE">❄️ Nevera</option>
                    <option value="PANTRY">🥫 Rebost</option>
                    <option value="FREEZER">🧊 Congelador</option>
                </select>
            </div>
        </div>

        {/* 3. CADUCITAT */}
        <div className="flex items-center gap-3 bg-slate-950/50 p-2 rounded-xl border border-slate-800/50">
            <span className="text-lg grayscale opacity-70">📅</span>
            <input 
                type="date"
                value={item.expiryDate || ''}
                onChange={(e) => onUpdate('expiryDate', e.target.value)}
                className="bg-transparent text-slate-300 text-sm font-mono border-none focus:ring-0 w-full p-0"
            />
            {!item.expiryDate && (
                <span className="text-[10px] text-orange-400 italic whitespace-nowrap px-2">
                    Sense data
                </span>
            )}
        </div>
    </div>
  );
}