// features/rooms/ui/CreateRoomForm.tsx
'use client' // <--- OBLIGATORI

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation'; // <--- IMPORTANT: next/navigation, NO next/router
import { createRoomAction } from '@/app/actions/room-actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function CreateRoomForm({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const router = useRouter(); // <--- Això hauria de funcionar ara
  const [isPending, startTransition] = useTransition();
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    if (!roomName.trim()) return;
    
    startTransition(async () => {
      const res = await createRoomAction(userId, roomName);
      if (res.success && res.roomId) {
        // Naveguem a la nova sala
        router.push(`/rooms/${res.roomId}`);
      } else {
        setError(res.error || t.common.error);
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">{t.room.create_title}</h2>
      
      <Input 
        label={t.room.room_name}
        placeholder="ex: Dinar Equip"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button 
        className="w-full" 
        onClick={handleCreate} 
        isLoading={isPending}
        disabled={!roomName.trim()}
      >
        {t.room.create_btn}
      </Button>
    </Card>
  );
}