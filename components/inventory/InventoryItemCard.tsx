'use client';
import { ConsumeButton } from './ConsumeButton';
import { isItemExpired, isItemExpiringSoon } from '@/lib/inventoryUtils';
import { EditItemModal } from './EditItemModal';
import { FOOD_PRESETS } from '@/lib/food-presets';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
// ✅ FUNCIÓ HELPER PER LES UNITATS
const getUnitEmoji = (unit: string) => {
  const u = unit.toLowerCase();
  if (['kg', 'g', 'mg'].includes(u)) return '⚖️'; // Pes
  if (['l', 'ml', 'cl'].includes(u)) return '💧'; // Líquid
  return '📦'; // Unitats / Altres
};
export function InventoryItemCard({ item }: { item: InventoryItemProps }) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const expired = isItemExpired(item);
  const expiringSoon = isItemExpiringSoon(item, 3);
  
  // TRADUCCIÓ NOM
  const matchedPreset = FOOD_PRESETS.find(p => 
     p.name.toLowerCase() === item.name.toLowerCase() || p.emoji === item.emoji
  );
  const itemTranslations = t.food?.items as Record<string, string> | undefined;
  const displayName = matchedPreset && itemTranslations?.[matchedPreset.id] 
      ? itemTranslations[matchedPreset.id] 
      : item.name;

  const displayEmoji = item.emoji || '📦';
  // ✅ Unitat com a Emoji
  const unitEmoji = getUnitEmoji(item.unit);
  
  // ESTILS
  let borderClass = 'border-slate-800 md:hover:border-slate-600';
  let bgClass = 'bg-slate-900 md:hover:bg-slate-800'; 
  
  if (expired) {
    borderClass = 'border-red-500/50';
    bgClass = 'bg-red-950/30';
  } else if (expiringSoon) {
    borderClass = 'border-amber-500/50';
    bgClass = 'bg-amber-950/20';
  }

  return (
    <>
      <div 
        onClick={() => setIsEditing(true)}
        className={`
            relative rounded-xl border ${borderClass} ${bgClass} 
            transition-all duration-200 cursor-pointer group 
            /* MÒBIL: Rectangular vertical / DESKTOP: Més alt */
            min-h-27.5 md:min-h-40
            flex flex-col
            p-2 md:p-3
            overflow-hidden shadow-sm hover:shadow-md
        `}
      >
        
        {/* --- 1. CAPÇALERA (Quantitat vs Botó Mòbil) --- */}
        <div className="flex justify-between items-start z-10">
            {/* BADGE QUANTITAT (Amb Emoji unitat) */}
            <div className="flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-white/5 gap-1">
                <span className="font-mono font-bold text-white text-[10px] md:text-xs">{item.quantity}</span>
                <span className="text-[10px] filter grayscale opacity-80">{unitEmoji}</span>
            </div>

            {/* BOTÓ CONSUMIR (NOMÉS MÒBIL - A DALT DRETA) */}
            <div className="block md:hidden">
                 <ConsumeButton itemId={item.id} currentQty={item.quantity} />
            </div>
            
            {/* INDICADOR CADUCITAT (NOMÉS DESKTOP PER NO TAPAR BOTÓ) */}
            {(expired || expiringSoon) && (
              <div className="hidden md:block absolute top-2 right-2">
                 <span className={`block w-2 h-2 rounded-full ${expired ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-amber-500 shadow-[0_0_8px_orange]'} animate-pulse`} />
              </div>
            )}
        </div>

        {/* --- 2. EMOJI CENTRAL --- */}
        <div className="flex-1 flex items-center justify-center py-1">
            <div className="text-3xl md:text-5xl filter drop-shadow-md transition-transform group-hover:scale-110">
                {displayEmoji}
            </div>
        </div>
  
        {/* --- 3. NOM (VISIBLE EN TOTS) --- */}
        {/* En Mòbil a baix del tot, centrat */}
        <div className="text-center mt-auto md:mb-2">
             <h4 className="text-[10px] md:text-xs font-bold text-slate-300 leading-tight line-clamp-1 group-hover:text-white">
                {displayName}
            </h4>
        </div>

        {/* --- 4. BOTÓ CONSUMIR (NOMÉS ESCRIPTORI - A BAIX) --- */}
        <div className="hidden md:block mt-1">
            <ConsumeButton itemId={item.id} currentQty={item.quantity} />
        </div>

      </div>

      {isEditing && (
        <EditItemModal item={item} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}