import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardContent } from '@/features/dashboard/components/DashboardContent'; 
import { container } from '@/services/container';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
// ✅ IMPORT DEL REPOSITORI NOU
import { SupabaseUserProfileRepository } from '@/adapters/supabase/SupabaseUserProfileRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  // ✅ 1. RECUPEREM EL PERFIL COMPLET (Amb la lògica que hem arreglat)
  const userRepo = new SupabaseUserProfileRepository();
  const userProfile = await userRepo.getById(user.id);

  // ✅ 2. DETERMINEM EL NOM A MOSTRAR
  // Si té 'username' al perfil, el fem servir. Si no, agafem el mail.
  const displayName = userProfile?.username || user.email?.split('@')[0] || 'Chef';

  // ✅ 3. RECUPEREM LES SALES (Server Side)
  const getUserRooms = container.getUserRooms();
  const rooms = (await getUserRooms.execute(user.id)) as DecisionRoom[];

  // ✅ 4. PREPAREM LES DADES DEL PERFIL PER A LA UI
  // Fem servir els getters de l'entitat UserProfile (.preferences, .restrictions)
  const profileData = {
    foodPreferences: userProfile?.preferences || [],
    exclusions: userProfile?.restrictions || []
  };

  // ✅ 5. MAPEGEM A DTO PER A LES SALES
  const roomsDTO = rooms.map(r => ({
    id: r.id,
    name: r.name,
    isHost: r.hostUserId === user.id
  }));

  // ✅ 6. RENDERITZEM
  return (
    <OnboardingProvider>
      <OnboardingOverlay />
      <DashboardContent
        userName={displayName} // Ara passarà "Hakermain" (o el que tinguis)
        userId={user.id}
        userRooms={roomsDTO}
        profileData={profileData}
      />
    </OnboardingProvider>
  );
}
