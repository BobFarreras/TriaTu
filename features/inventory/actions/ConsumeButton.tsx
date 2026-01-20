'use client';

import { useTransition } from 'react';
import { consumeItemAction } from '@/app/actions/inventory';
import { toast } from 'sonner';

interface Props {
  itemId: string;
  currentQty: number;
  onRefresh?: () => void; // ✅ NOVA PROP OPCIONAL
}

export function ConsumeButton({ itemId, currentQty, onRefresh }: Props) {
  const [isPending, startTransition] = useTransition();

  // Si queda 1 o menys, és l'últim
  const isLastItem = currentQty <= 1;

  const handleConsume = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      try {
        await consumeItemAction(itemId, 1);

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(isLastItem ? 50 : 20);
        }

        // ✅ AQUESTA ÉS LA MÀGIA QUE ET FALTAVA
        // Avisem al InventoryManager que torni a demanar les dades
        if (onRefresh) {
          onRefresh();
        }

      } catch (error) {
        console.log(error)
        toast.error("Error", { description: "Error al consumir" });
      }
    });
  };

  // ESTILS BASE: Molt subtils (fons fosc transparent, sense vores fortes)
  const baseStyles = "relative flex items-center justify-center transition-all duration-200 overflow-hidden group z-20 backdrop-blur-sm";

  // ESTATS DE COLOR (Només es noten al Hover)
  const colorStyles = isLastItem
    ? "bg-black/20 hover:bg-red-900/30 text-slate-400 hover:text-red-300" // Acabar: Subtil -> Vermellós al hover
    : "bg-black/20 hover:bg-purple-900/30 text-slate-400 hover:text-white"; // Consumir: Subtil -> Blanc al hover

  return (
    <button
      onClick={handleConsume}
      disabled={isPending}
      data-testid="inventory-consume-button"
      className={`${baseStyles} ${colorStyles} 
        /* MÒBIL: Cercle petit (32px) */
        w-8 h-8 rounded-full 
        /* DESKTOP: Més ample, rectangle arrodonit */
        md:w-full md:h-8 md:rounded-lg
      `}
    >
      {/* LOADING STATE */}
      {isPending ? (
        <span className="animate-spin text-xs">⏳</span>
      ) : isLastItem ? (
        <>
          {/* ICONA PAPERERA */}
          <span className="text-sm md:text-base filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
            🗑️
          </span>
          {/* TEXT (Només Desktop) */}
          <span className="hidden md:inline ml-2 text-[10px] font-bold uppercase tracking-wider">
            Acabar
          </span>
        </>
      ) : (
        <>
          {/* ICONA RESTAR */}
          <span className="text-sm md:text-base opacity-70 group-hover:opacity-100 transition-all">
            ➖
          </span>
          {/* TEXT (Només Desktop) */}
          <span className="hidden md:inline ml-2 text-[10px] font-bold uppercase tracking-wider">
            Consumir
          </span>
        </>
      )}
    </button>
  );
}
