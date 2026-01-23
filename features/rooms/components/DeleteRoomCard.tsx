// src/features/rooms/components/DeleteRoomCard.tsx
'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { deleteRoom } from '@/features/rooms/actions/delete-room';

interface Props {
  roomId: string;
  roomName: string;
}

export function DeleteRoomCard({ roomId, roomName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteRoom(roomId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconegut');
        setShowConfirm(false); // Tanquem el diàleg si falla
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="p-6 border border-red-200 bg-red-50 rounded-xl animate-in fade-in zoom-in-95">
        <h3 className="text-red-900 font-bold text-lg mb-2">Estàs segur?</h3>
        <p className="text-red-700 text-sm mb-4">
          Aquesta acció eliminarà permanentment la sala <strong>{roomName}</strong> i tot el seu contingut (inventari, llistes, decisions). Aquesta acció no es pot desfer.
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel·lar
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? 'Eliminant...' : 'Sí, eliminar sala'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-red-100 rounded-xl p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Eliminar Sala</h3>
          <p className="text-slate-500 text-sm mt-1">
            Elimina aquesta sala i expulsa tots els participants.
          </p>
          {error && <p className="text-red-500 text-xs mt-2 font-medium">⚠️ {error}</p>}
        </div>
        
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
        >
          Eliminar Sala
        </button>
      </div>
    </div>
  );
}