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
  // enableShopping?: boolean; // Per al futur
}

export function RoomFeaturesPanel({ roomId, isHost, enableInventory }: RoomFeaturesPanelProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      // Optimistic UI (podries posar un state local aquí si volguessis feedback instantani)
      const res = await toggleRoomFeatureAction(roomId, 'INVENTORY', checked);
      if (res.success) {
        toast.success(checked ? "Inventari activat" : "Inventari desactivat");
      } else {
        toast.error(res.error);
      }
    });
  };

  const navigateToInventory = () => {
    // Truc: Podríem passar un query param ?room=ID perquè l'inventari s'obri directament allà
    router.push(`/inventory?room=${roomId}`);
  };

  if (!enableInventory && !isHost) return null; // Si està desactivat i no ets admin, no veus res.

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* 1. INFORMACIÓ I ICONA */}
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

      {/* 2. CONTROLS (Host Toggle & Navigation) */}
      <div className="flex items-center gap-3">
        
        {/* Toggle per Admin */}
        {isHost && (
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
            <button
              disabled={isPending}
              onClick={() => handleToggle(false)}
              className={`p-2 rounded-md transition-all ${!enableInventory ? 'bg-red-500/20 text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <Lock size={16} />
            </button>
            <button
              disabled={isPending}
              onClick={() => handleToggle(true)}
              className={`p-2 rounded-md transition-all ${enableInventory ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <Unlock size={16} />
            </button>
          </div>
        )}

        {/* Botó d'Accés (Només si està actiu) */}
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
  );
}