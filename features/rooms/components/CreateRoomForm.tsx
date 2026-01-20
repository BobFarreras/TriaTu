'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createRoomAction } from '@/app/actions/room-actions';
import { Button } from '@/components/ui/Button';
// Assumint que tens aquests components UI, si no, usa HTML normal
import { Card } from '@/components/ui/Card'; 
import { Input } from '@/components/ui/Input'; 
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function CreateRoomForm({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    if (!roomName.trim()) return;

    startTransition(async () => {
      const res = await createRoomAction(userId, roomName);

      if (res.success && res.roomId) {
        router.push(`/rooms/${res.roomId}`);
      } else {
        // Usem un missatge d'error del diccionari o el que ve del servidor
        setError(res.error || t.create_room.err_unknown);
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto space-y-6 p-6"> {/* Afegit padding */}
      {/* ✅ CORREGIT: Usem 'hero_title' de 'create_room' */}
      <h2 className="text-xl font-bold">{t.create_room.hero_title}</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">
            {/* ✅ CORREGIT: Usem 'label_name' */}
            {t.create_room.label_name}
        </label>
        <Input
            // Si el teu component Input té label, fes servir això, sinó el label de dalt
            placeholder={t.create_room.placeholder_name}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        className="w-full"
        onClick={handleCreate}
        isLoading={isPending}
        disabled={!roomName.trim()}
      >
        {/* ✅ CORREGIT: Usem 'btn_create' */}
        {t.create_room.btn_create}
      </Button>
    </Card>
  );
}