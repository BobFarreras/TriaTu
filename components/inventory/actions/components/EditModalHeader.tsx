'use client';

import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';

interface Props {
  item: InventoryItemProps;
  onClose: () => void;
}

export function EditModalHeader({ item, onClose }: Props) {
  return (
    // ✅ CANVI: h-40 en mòbil (molt més baixet)
    <div className="relative h-40 sm:h-56 bg-white flex items-center justify-center p-4 shrink-0 overflow-hidden">
      
      <button 
        onClick={onClose} 
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors z-20 shadow-sm"
      >
        ✕
      </button>

      <div className="relative w-full h-full flex items-center justify-center z-10">
        {item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={item.image} 
            alt={item.name} 
            className="max-h-full w-auto object-contain drop-shadow-lg" 
          />
        ) : (
          <span className="text-6xl sm:text-8xl filter drop-shadow-lg">{item.emoji}</span>
        )}
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-0" />
      
      <div className="absolute bottom-2 left-4 right-4 text-center z-20">
         <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight drop-shadow-sm line-clamp-1">
           {item.name}
         </h2>
      </div>
    </div>
  );
}