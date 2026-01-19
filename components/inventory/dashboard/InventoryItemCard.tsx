// src/components/dashboard/InventoryItemCard.tsx
'use client';

import { ConsumeButton } from '../actions/ConsumeButton'; // Assegura't de la ruta
import { isItemExpired, isItemExpiringSoon } from '@/lib/inventoryUtils';
import { EditItemModal } from '../actions/EditItemModal';
import { FOOD_PRESETS } from '@/lib/food-presets';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';

const getUnitEmoji = (unit: string) => {
  const u = unit.toLowerCase();
  if (['kg', 'g', 'mg'].includes(u)) return '⚖️';
  if (['l', 'ml', 'cl'].includes(u)) return '💧';
  return '📦';
};

interface Props {
  item: InventoryItemProps;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRefresh?: () => void; // ✅ Prop rebuda correctament
}

export function InventoryItemCard({ item, isSelectionMode, isSelected, onToggleSelect, onRefresh }: Props) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const expired = isItemExpired(item);
  const expiringSoon = isItemExpiringSoon(item, 3);
  const displayEmoji = item.emoji || '📦';
  const unitEmoji = getUnitEmoji(item.unit);

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelect(item.id);
    } else {
      setIsEditing(true);
    }
  };

  // --- SOLUCIÓ ERROR TYPESCRIPT ---
  // Calculaves el nom però no l'usaves. Ara l'usarem a baix.
  const matchedPreset = FOOD_PRESETS.find(p =>
    p.name.toLowerCase() === item.name.toLowerCase() || p.emoji === item.emoji
  );
  const itemTranslations = t.food?.items as Record<string, string> | undefined;

  const displayName = matchedPreset && itemTranslations?.[matchedPreset.id]
    ? itemTranslations[matchedPreset.id]
    : item.name;

  // ESTILS
  let borderClass = 'border-slate-800 md:hover:border-slate-600';
  let bgClass = 'bg-slate-900 md:hover:bg-slate-800';

  if (isSelected) {
    borderClass = 'border-emerald-500 ring-1 ring-emerald-500';
    bgClass = 'bg-emerald-900/20';
  } else if (isSelectionMode) {
    borderClass = 'border-slate-700 border-dashed opacity-80';
  } else if (expired) {
    borderClass = 'border-red-500/50';
    bgClass = 'bg-red-950/30';
  } else if (expiringSoon) {
    borderClass = 'border-amber-500/50';
    bgClass = 'bg-amber-950/20';
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`
            relative rounded-xl border ${borderClass} ${bgClass} 
            transition-all duration-200 cursor-pointer group 
            min-h-27.5 md:min-h-40
            flex flex-col p-2 md:p-3
            overflow-hidden shadow-sm hover:shadow-md
            ${isSelected ? 'transform scale-[0.98]' : ''}
        `}
      >

        {/* OVERLAYS SELECCIÓ */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-20 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-in zoom-in">✓</div>
        )}
        {isSelectionMode && !isSelected && (
          <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full border-2 border-slate-600 bg-slate-900/50" />
        )}

        {/* --- CAPÇALERA --- */}
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center justify-center bg-black/60 backdrop-blur-md rounded-md px-1.5 py-0.5 border border-white/10 gap-1 shadow-sm">
            <span className="font-mono font-bold text-white text-[10px] md:text-xs">{item.quantity}</span>
            <span className="text-[10px] filter grayscale opacity-80">{unitEmoji}</span>
          </div>

          {!isSelectionMode && (
            <div className="block md:hidden">
              {/* ✅ BOTÓ MÒBIL: Aquest ja el tenies bé */}
              <ConsumeButton
                itemId={item.id}
                currentQty={item.quantity}
                onRefresh={onRefresh}
              />
            </div>
          )}

          {!isSelectionMode && (expired || expiringSoon) && (
            <div className="hidden md:block absolute top-2 right-2">
              <span className={`block w-2 h-2 rounded-full ${expired ? 'bg-red-500' : 'bg-amber-500'} animate-pulse`} />
            </div>
          )}
        </div>

        {/* --- IMATGE --- */}
        <div className="flex-1 flex items-center justify-center py-1 relative">
          {item.image && !imageError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.image}
              alt={displayName}
              // 👇 AFEGEIX AQUESTA LÍNIA CLAU:
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain max-h-20 md:max-h-25 drop-shadow-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-4xl md:text-6xl filter drop-shadow-md select-none">{displayEmoji}</div>
          )}
        </div>

        {/* --- NOM DEL PRODUCTE --- */}
        <div className="text-center mt-auto md:mb-2 z-10">
          <h4 className="text-[10px] md:text-xs font-bold text-slate-300 leading-tight line-clamp-2">
            {/* ✅ AQUÍ SOLUCIONEM L'ERROR TS: Fem servir la variable displayName */}
            {displayName}
          </h4>
        </div>

        {/* --- BOTÓ DESKTOP --- */}
        {!isSelectionMode && (
          <div className="hidden md:block mt-1">
            {/* 🚨🚨🚨 L'ERROR ERA AQUÍ: Faltava passar onRefresh!! 🚨🚨🚨 */}
            <ConsumeButton
              itemId={item.id}
              currentQty={item.quantity}
              onRefresh={onRefresh} // ✅ ARA SÍ!
            />
          </div>
        )}

      </div>

      {isEditing && !isSelectionMode && (
        <EditItemModal item={item} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}