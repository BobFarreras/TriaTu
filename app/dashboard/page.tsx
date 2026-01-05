import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { DashboardContent } from '@/features/dashboard/ui/DashboardContent'; // Assegura't que la ruta és correcta
import { container } from '@/services/container';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const name = user.email?.split('@')[0] || 'Jugador 1';

  // ✅ 1. RECUPEREM LES SALES (Server Side)
  const getUserRooms = container.getUserRooms();
  const rooms = await getUserRooms.execute(user.id);

  // ✅ 2. RECUPEREM EL PERFIL (NOU)
  // Nota: Si tens un UseCase 'getUserProfile', usa'l. Si no, fem una crida directa segura (Read Model).
  const { data: rawProfile } = await supabase
    .from('preference_profiles')
    .select('food_preferences, exclusions')
    .eq('user_id', user.id)
    .single();

  // Normalitzem per evitar errors si és null
  const profile = {
    foodPreferences: rawProfile?.food_preferences || [],
    exclusions: rawProfile?.exclusions || []
  };

  // ✅ 3. Mapegem a DTO simple per a les sales
  const roomsDTO = rooms.map(r => ({
    id: r.id,
    name: r.name,
    isHost: r.hostUserId === user.id
  }));

  // ✅ 4. Passem totes les dades al client
  return (
    <OnboardingProvider> {/* 👈 IMPORTANT */}
      <OnboardingOverlay /> {/* 👈 IMPORTANT */}
      <DashboardContent
        userName={name}
        userId={user.id}
        userRooms={roomsDTO}
        profileData={profile} // Ara 'profile' ja existeix
      />
    </OnboardingProvider>
  );
}