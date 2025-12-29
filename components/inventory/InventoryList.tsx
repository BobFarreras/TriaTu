// src/components/inventory/InventoryList.tsx
'use client';

import { InventoryItemProps } from '@/core/domain/entities/InventoryItem'; // <--- Interface
import { ConsumeButton } from './ConsumeButton';
import { isItemExpired, isItemExpiringSoon } from '@/lib/inventoryUtils'; // <--- Utils

export function InventoryList({ items }: { items: InventoryItemProps[] }) {
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
        <p className="text-4xl mb-2 grayscale opacity-50">👻</p>
        <p className="text-slate-500 text-sm">No s'han trobat aliments aquí.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {items.map((item) => (
        <InventoryItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function InventoryItemCard({ item }: { item: InventoryItemProps }) {
    const expired = isItemExpired(item);
    const expiringSoon = isItemExpiringSoon(item, 3);
  
    // 1. EXTRACTOR D'EMOJIS
    let displayEmoji = '📦';
    let displayName = item.name; // <--- Ara és item.name directe

    // Regex compatible i simple per detectar icones al principi
    const parts = item.name.split(' ');
    if (parts.length > 1 && parts[0].length <= 2 && /[^a-zA-Z0-9à-úÀ-Ú]/.test(parts[0])) {
        displayEmoji = parts[0];
        displayName = parts.slice(1).join(' ');
    }

    // 2. ESTILS
    let borderClass = 'border-slate-800 hover:border-slate-600';
    let bgClass = 'bg-slate-900/50 hover:bg-slate-800'; // Inicialització per defecte
    let statusDot = null;
  
    if (expired) {
      borderClass = 'border-red-500/50';
      bgClass = 'bg-red-900/10'; // <--- Reassignació correcta
      statusDot = <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]" title="Caducat"></span>;
    } else if (expiringSoon) {
      borderClass = 'border-amber-500/50';
      bgClass = 'bg-amber-900/10'; // <--- Reassignació correcta
      statusDot = <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_orange]" title="Caduca Aviat"></span>;
    }
  
    return (
      <div className={`relative p-3 rounded-xl border ${borderClass} ${bgClass} transition-all group flex flex-col justify-between h-full min-h-35`}>
        
        {statusDot}

        <div className="flex flex-col items-center text-center mt-1">
            <div className="text-4xl mb-2 drop-shadow-md transform group-hover:scale-110 transition-transform cursor-default">
                {displayEmoji}
            </div>
            
            <h4 className="text-sm font-bold text-slate-200 leading-tight line-clamp-2 min-h-[2.5em]">
                {displayName}
            </h4>
            
            <p className="text-xs text-slate-500 font-mono mt-1">
                {item.quantity}<span className="text-slate-600 ml-0.5">{item.unit}</span>
            </p>
        </div>
  
        <div className="mt-3 pt-2 border-t border-white/5 flex justify-center w-full">
           <ConsumeButton itemId={item.id} currentQty={item.quantity} />
        </div>
      </div>
    );
}