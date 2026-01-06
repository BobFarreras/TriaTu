// =================== FILE: src/app/rooms/[id]/page.tsx ===================
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { GetDecisionRoom } from '@/core/usecases/rooms/GetDecisionRoom';
import { RoomDetail, RoomDTO } from '@/features/rooms/ui/RoomDetail';
import { CandidateDTO } from '@/features/rooms/ui/DecisionControls';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext'; // ✅
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay'; // ✅
// Forcem que la pàgina es generi al servidor en cada petició (necessari per validar auth)
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

  // 1. Instanciem Repositori i Use Case
  const roomRepo = new SupabaseDecisionRoomRepository();
  const getRoomUseCase = new GetDecisionRoom(roomRepo);

  let room;

  try {
    // 2. Intentem obtenir la sala. 
    // Si l'usuari no té permís o la sala no existeix, el UseCase o el Repo llançaran error/null.
    room = await getRoomUseCase.execute(id, user.id);
  } catch (error) {
    // 3. SEGURETAT PER OBSCURITAT:
    // Tant si és "No trobat", "Sense permís" o "Error DB", mostrem 404.
    // Així no donem pistes de si la sala existeix o no.
    console.error(`Error loading room ${id}:`, error);
    notFound();
  }

  // 4. Carregar Candidats (Només si hem passat el filtre de la sala)
  const candidateRepo = new SupabaseCandidateRepository();
  const candidates = await candidateRepo.getAllForRoom(id);

  // 5. Mapeig a DTOs per a la UI
  // 5. Mapeig a DTOs per a la UI
  const roomDTO: RoomDTO = {
    id: room.id,
    name: room.name,
    hostUserId: room.hostUserId,
    votingMode: room.votingMode,
    // ✅ AFEGIM AIXÒ: Assegura't que el teu Repo retorna aquest camp de la DB!
    inviteCode: room.inviteCode,
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
    // ✅ ENVOLTEM AMB EL PROVIDER
    <OnboardingProvider>
      <OnboardingOverlay />

      <RoomDetail
        room={roomDTO}
        initialCandidates={candidatesDTO}
        currentUserId={user.id}
      />
    </OnboardingProvider>
  );
}