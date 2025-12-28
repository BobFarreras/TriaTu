'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { joinRoomAction } from '@/app/actions/room-actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function JoinRoomForm({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    if (!roomId.trim()) return;

    startTransition(async () => {
      const res = await joinRoomAction(roomId, userId);
      
      if (res.success) {
        router.push(`/rooms/${roomId}`);
      } else {
        // Mostrem l'error del servidor o un de genèric
        setError(res.error || t.common.error);
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto space-y-6 p-6"> {/* Padding afegit per consistència */}
      
      {/* ✅ CORREGIT: Usem 'hero_title' de la secció 'join_room' */}
      <h2 className="text-xl font-bold">{t.join_room.hero_title}</h2>
      
      <Input 
        // ✅ CORREGIT: Claus correctes del diccionari
        label={t.join_room.label_code}
        placeholder={t.join_room.placeholder_code}
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
        {/* ✅ CORREGIT: Text del botó */}
        {t.join_room.btn_join}
      </Button>
    </Card>
  );
}