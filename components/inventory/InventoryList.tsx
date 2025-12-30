'use client';

import { useState } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { ConsumeButton } from './ConsumeButton';
import { isItemExpired, isItemExpiringSoon } from '@/lib/inventoryUtils';
import { EditItemModal } from './EditItemModal'; 

export function InventoryList({ items }: { items: InventoryItemProps[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
        <p className="text-4xl mb-2 grayscale opacity-50">👻</p>
        <p className="text-slate-500 text-sm">No s'han trobat aliments aquí.</p>
      </div>
    );
  }

  // Grid ajustat per ser més compacte
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {items.map((item) => (
        <InventoryItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function InventoryItemCard({ item }: { item: InventoryItemProps }) {
  const [isEditing, setIsEditing] = useState(false);

  const expired = isItemExpired(item);
  const expiringSoon = isItemExpiringSoon(item, 3);
  const displayEmoji = item.emoji || '📦';
  
  // Estils base
  let borderClass = 'border-slate-800 hover:border-slate-600';
  let bgClass = 'bg-slate-900 hover:bg-slate-800'; 
  let statusDot = null;
  
  // Lògica d'estats (Caducat / A punt de caducar)
  if (expired) {
    borderClass = 'border-red-500/50';
    bgClass = 'bg-red-950/20 hover:bg-red-900/30';
    statusDot = (
      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red] z-10" title="Caducat" />
    );
  } else if (expiringSoon) {
    borderClass = 'border-amber-500/50';
    bgClass = 'bg-amber-950/20 hover:bg-amber-900/30';
    statusDot = (
      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_orange] z-10" title="Caduca Aviat" />
    );
  }

  // Color del badge segons la unitat (Visualment útil)
  const unitColor = item.unit === 'kg' || item.unit === 'g' ? 'text-blue-300' 
                  : item.unit === 'l' ? 'text-cyan-300' 
                  : 'text-purple-300';

  return (
    <>
      <div 
        onClick={() => setIsEditing(true)}
        className={`
            relative p-2 pb-3 rounded-2xl border ${borderClass} ${bgClass} 
            transition-all duration-200 cursor-pointer group 
            flex flex-col justify-between h-full min-h-35 shadow-sm hover:shadow-md hover:-translate-y-1
        `}
      >
        
        {/* HEADER: Quantitat (Badge) + Status */}
        <div className="flex justify-between items-start w-full relative z-10">
            {/* BADGE DE QUANTITAT (Més visible) */}
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg px-2 py-1 flex items-baseline gap-1 shadow-sm">
                <span className="font-mono font-bold text-white text-sm">{item.quantity}</span>
                <span className={`text-[10px] font-bold uppercase ${unitColor}`}>{item.unit}</span>
            </div>
            
            {statusDot}
        </div>

        {/* CONTENT: Emoji + Nom */}
        <div className="flex flex-col items-center text-center mt-2 mb-2">
            <div className="text-3xl mb-1 filter drop-shadow-md transition-transform group-hover:scale-110">
                {displayEmoji}
            </div>
            
            <h4 className="text-xs sm:text-sm font-bold text-slate-300 leading-tight line-clamp-2 px-1 group-hover:text-white transition-colors">
                {item.name}
            </h4>
        </div>
  
        {/* FOOTER: Botó Consumir */}
        {/* stopPropagation és CLAU: evita que s'obri el modal quan vols gastar */}
        <div 
            className="mt-auto pt-2 flex justify-center w-full" 
            onClick={(e) => e.stopPropagation()} 
        >
           <ConsumeButton itemId={item.id} currentQty={item.quantity} />
        </div>

      </div>

      {/* MODAL */}
      {isEditing && (
        <EditItemModal 
          item={item} 
          onClose={() => setIsEditing(false)} 
        />
      )}
    </>
  );
}