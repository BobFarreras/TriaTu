'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleRoomFeatureAction } from '@/app/actions/room-actions';
import { Package, ShoppingCart, ArrowRight, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

interface RoomFeaturesPanelProps {
  roomId: string;
  isHost: boolean;
  enableInventory: boolean;
  enableShoppingList: boolean;
}

export function RoomFeaturesPanel({ roomId, isHost, enableInventory, enableShoppingList }: RoomFeaturesPanelProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleInventory = (checked: boolean) => {
    startTransition(async () => {
      // Optimistic UI (podries posar un state local aquí si volguessis feedback instantani)
      const res = await toggleRoomFeatureAction(roomId, 'INVENTORY', checked);
      if (res.success) {
        toast.success(checked ? "Inventari activat" : "Inventari desactivat");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggleShopping = (checked: boolean) => {
    startTransition(async () => {
      const res = await toggleRoomFeatureAction(roomId, 'SHOPPING', checked);
      if (res.success) {
        toast.success(checked ? "Llista de la compra activada" : "Llista de la compra desactivada");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const navigateToInventory = () => {
    // Truc: Podríem passar un query param ?room=ID perquè l'inventari s'obri directament allà
    router.push(`/inventory?room=${roomId}`);
  };

  const navigateToShoppingList = () => {
    router.push('/shopping-list');
  };

  if (!enableInventory && !enableShoppingList && !isHost) return null; // Si està tot desactivat i no ets admin, no veus res.

  return (
    <div className="w-full space-y-4">
      
      {/* INVENTARI */}
      {(enableInventory || isHost) && (
        <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${enableInventory ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
              <Package size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Inventari Compartit</h3>
              <p className="text-xs text-slate-500">
                {enableInventory
                  ? "Actiu. Tots els membres poden veure i editar."
                  : "Desactivat. Activa-ho per gestionar productes."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isHost && (
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
                <button
                  disabled={isPending}
                  onClick={() => handleToggleInventory(false)}
                  className={`p-2 rounded-md transition-all ${!enableInventory ? 'bg-red-500/20 text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Lock size={16} />
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleToggleInventory(true)}
                  className={`p-2 rounded-md transition-all ${enableInventory ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Unlock size={16} />
                </button>
              </div>
            )}

            {enableInventory && (
              <button
                onClick={navigateToInventory}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
              >
                <span>Obrir Nevera</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SHOPPING LIST */}
      {(enableShoppingList || isHost) && (
        <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${enableShoppingList ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-500'}`}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Llista de la Compra Compartida</h3>
              <p className="text-xs text-slate-500">
                {enableShoppingList
                  ? "Activa. Tots els membres poden veure i editar."
                  : "Desactivada. Activa-la per compartir la compra."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isHost && (
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
                <button
                  disabled={isPending}
                  onClick={() => handleToggleShopping(false)}
                  className={`p-2 rounded-md transition-all ${!enableShoppingList ? 'bg-red-500/20 text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Lock size={16} />
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleToggleShopping(true)}
                  className={`p-2 rounded-md transition-all ${enableShoppingList ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Unlock size={16} />
                </button>
              </div>
            )}

            {enableShoppingList && (
              <button
                onClick={navigateToShoppingList}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95"
              >
                <span>Obrir Llista</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
