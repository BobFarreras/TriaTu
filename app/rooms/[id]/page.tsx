import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { RoomDetail, RoomDTO } from '@/features/rooms/ui/RoomDetail';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { id } = await params;
  
  // 1. Obtenir usuari real
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Si intenten entrar a una sala sense estar loguejats, al login
    redirect(`/login?next=/rooms/${id}`);
  }

  // 2. Carregar la sala
  const repo = new SupabaseDecisionRoomRepository();
  const room = await repo.findById(id);

  if (!room) {
    notFound();
  }

  // 3. Crear DTO
  const roomDTO: RoomDTO = {
    id: room.id,
    name: room.name,
    hostUserId: room.hostUserId,
    participants: room.participants.map(p => ({ userId: p.userId })),
    history: room.history.map(h => ({
        choice: h.choice,
        reason: h.reason,
        date: h.generatedAt.toISOString()
    }))
  };

  return (
    // Passem l'ID real de l'usuari autenticat
    <RoomDetail room={roomDTO} currentUserId={user.id} />
  );
}