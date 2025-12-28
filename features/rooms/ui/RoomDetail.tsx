'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState, useTransition } from 'react';
import { joinRoomAction } from '@/app/actions/room-actions';
import { DecisionHistory } from './DecisionHistory';
import { DecisionControls } from './DecisionControls';

// DTO ACTUALITZAT: Sense status
export type RoomDTO = {
  id: string;
  name: string;
  hostUserId: string;
  participants: { userId: string }[];
  history: { choice: string; reason: string; date: string }[];
};

interface RoomDetailProps {
  room: RoomDTO;
  currentUserId: string;
}

export function RoomDetail({ room, currentUserId }: RoomDetailProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const isParticipant = room.participants.some(p => p.userId === currentUserId);
  const hasEnoughParticipants = room.participants.length > 0;

  const handleJoin = () => {
    startTransition(async () => {
      await joinRoomAction(room.id, currentUserId);
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 pb-24">
      {/* Capçalera */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{room.name}</h1>
        
        <div 
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors border border-dashed border-gray-400"
        >
          <span className="text-sm font-mono text-gray-600 dark:text-gray-400">ID:</span>
          <span className="font-mono font-bold">{room.id}</span>
          <span className="text-xs ml-2 bg-white dark:bg-black px-2 py-1 rounded shadow-sm">
            {copied ? 'Copiado!' : 'Copiar'}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* COLUMNA ESQUERRA: Accions i Participants */}
        <div className="space-y-6">
          {/* Controls de Decisió */}
          {isParticipant ? (
            <DecisionControls 
                roomId={room.id} 
                userId={currentUserId} 
                hasEnoughParticipants={hasEnoughParticipants}
            />
          ) : (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
               <h3 className="font-bold mb-2">{t.room.join_title}</h3>
               <p className="text-sm mb-4">Uneix-te per participar en les decisions.</p>
               <Button className="w-full" onClick={handleJoin} isLoading={isPending}>
                 Unir-se ara
               </Button>
            </Card>
          )}

          {/* Llista de Participants */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
              👥 {t.room.participants}
              <span className="bg-gray-100 dark:bg-zinc-800 text-xs px-2 py-1 rounded-full">
                {room.participants.length}
              </span>
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {room.participants.map((p, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                   <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                     {p.userId.slice(0, 2)}
                   </div>
                   <span className="font-mono text-sm opacity-70">{p.userId.slice(0, 8)}...</span>
                   {p.userId === currentUserId && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded ml-auto">YOU</span>}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* COLUMNA DRETA: Historial */}
        <div>
           <DecisionHistory history={room.history} />
        </div>

      </div>
    </div>
  );
}