// =================== FILE: src/app/rooms/[id]/page.tsx ===================
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { GetDecisionRoom } from '@/core/usecases/rooms/GetDecisionRoom';
import { RoomDetail, RoomDTO } from '@/features/rooms/ui/RoomDetail';
import { CandidateDTO } from '@/features/rooms/ui/DecisionControls';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { DecisionMetadata } from '@/core/domain/types/DecisionTypes';
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}


// Interfície local per al map, però usant el tipus de domini
interface HistoryItemWithMetadata {
  choice: string;
  reason: string;
  generatedAt: Date;
  metadata?: DecisionMetadata; // ✅ Tipus segur
}
export default async function RoomPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/rooms/${id}`);

  // 1. Instanciem Repositori i Use Case
  const roomRepo = new SupabaseDecisionRoomRepository();
  const getRoomUseCase = new GetDecisionRoom(roomRepo);

  let room;
  try {
    room = await getRoomUseCase.execute(id, user.id);
  } catch (error) {
    console.error(`Error loading room ${id}:`, error);
    notFound();
  }

  // 4. Carregar Candidats
  const candidateRepo = new SupabaseCandidateRepository();
  const candidates = await candidateRepo.getAllForRoom(id);

  // 5. Mapeig a DTOs per a la UI (Presentation Layer)
  const roomDTO: RoomDTO = {
    id: room.id,
    name: room.name,
    hostUserId: room.hostUserId,
    votingMode: room.votingMode,
    inviteCode: room.inviteCode,
    participants: room.participants.map(p => ({ userId: p.userId })),

    // ✅ CORRECCIÓ CLAU: Ara passem la metadata al DTO
    // ✅ CORRECCIÓ: Tipem explícitament 'h'
    history: room.history.map((h) => {
      // Fem un cast segur perquè sabem que hem passat la metadata des del repositori
      const item = h as unknown as HistoryItemWithMetadata;

      return {
        choice: item.choice,
        reason: item.reason,
        date: item.generatedAt.toISOString(),
        metadata: item.metadata // Ara ja no és any
      };
    })
  };
  const candidatesDTO: CandidateDTO[] = candidates.map(c => ({
    id: c.id,
    userId: c.userId,
    content: c.content
  }));

  return (
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