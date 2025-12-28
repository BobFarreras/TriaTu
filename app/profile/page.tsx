import Link from 'next/link'; // <--- IMPORT CRÍTIC
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabasePreferenceRepository } from '@/adapters/supabase/SupabasePreferenceRepository';
// CORRECCIÓ: 'ProfileForm' en lloc de 'ProfileFrom'
import { ProfileForm } from '@/features/profile/ui/ProfileFrom';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const repo = new SupabasePreferenceRepository();
  const profile = await repo.findByUserId(user.id);

  // Casting segur per llegir dades privades al DTO inicial
  const exclusions = profile 
    ? (profile as unknown as { exclusions: string[] }).exclusions 
    : [];

  const initialData = {
    foodPreferences: profile?.foodPreferences || [],
    exclusions: exclusions,
    socialTolerance: profile?.socialTolerance || 5
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-black">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Configuració</h1>
        
        {/* CORRECCIÓ: Usem Link en lloc de <a> */}
        <Link href="/" className="text-sm text-blue-500 hover:underline transition-colors">
          ← Tornar a l'inici
        </Link>
      </div>
      
      <ProfileForm initialData={initialData} />
    </div>
  );
}