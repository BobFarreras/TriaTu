'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { joinRoomAction } from '@/app/actions/room-actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// NOU: Acceptem userId com a prop
export function JoinRoomForm({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    if (!roomId.trim()) return;

    startTransition(async () => {
      // Usem l'ID real passat per prop
      const res = await joinRoomAction(roomId, userId);
      
      if (res.success) {
        // Redirigim SENSE paràmetres d'usuari a la URL
        router.push(`/rooms/${roomId}`);
      } else {
        setError(res.error || t.common.error);
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">{t.room.join_title}</h2>
      
      <Input 
        label="ID de la Sala (UUID)"
        placeholder="ex: 550e8400..."
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button 
        className="w-full" 
        onClick={handleJoin} 
        isLoading={isPending}
        disabled={!roomId.trim()}
      >
        {t.room.join_title}
      </Button>
    </Card>
  );
}