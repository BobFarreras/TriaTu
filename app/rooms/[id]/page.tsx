import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository'; // <--- NOU
import { RoomDetail, RoomDTO } from '@/features/rooms/ui/RoomDetail';
import { CandidateDTO } from '@/features/rooms/ui/DecisionControls';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/rooms/${id}`);
  }

  // 1. Carregar Sala
  const roomRepo = new SupabaseDecisionRoomRepository();
  const room = await roomRepo.findById(id);
  if (!room) notFound();

  // 2. Carregar Candidats (NOU)
  const candidateRepo = new SupabaseCandidateRepository();
  const candidates = await candidateRepo.getAllForRoom(id);

  // 3. Crear DTOs
const roomDTO: RoomDTO = {
    id: room.id,
    name: room.name,
    hostUserId: room.hostUserId,
    // Ara 'votingMode' ja existeix a l'objecte 'room' gràcies al FIX 1
    votingMode: room.votingMode, 
    participants: room.participants.map(p => ({ userId: p.userId })),
    history: room.history.map(h => ({
        choice: h.choice,
        reason: h.reason,
        date: h.generatedAt.toISOString()
    }))
  };

  const candidatesDTO: CandidateDTO[] = candidates.map(c => ({
    id: c.id,
    userId: c.userId,
    content: c.content
  }));

  return (
    <RoomDetail 
      room={roomDTO} 
      initialCandidates={candidatesDTO} // Passem la llista inicial
      currentUserId={user.id} 
    />
  );
}