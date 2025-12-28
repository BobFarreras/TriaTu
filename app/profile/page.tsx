// =================== FILE: app/profile/page.tsx ===================

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabasePreferenceRepository } from '@/adapters/supabase/SupabasePreferenceRepository';
import { ProfileForm } from '@/features/profile/ui/ProfileFrom';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const repo = new SupabasePreferenceRepository();
  const profile = await repo.findByUserId(user.id);

  const exclusions = profile 
    ? (profile as unknown as { exclusions: string[] }).exclusions 
    : [];

  const initialData = {
    foodPreferences: profile?.foodPreferences || [],
    exclusions: exclusions,
    socialTolerance: profile?.socialTolerance || 5
  };

  return (
    // CANVI CLAU: Eliminem 'bg-gray-50' perquè es vegi el fons global
    <div className="min-h-screen p-4 md:p-8 pb-32">
      
      {/* HEADER AMB ANIMACIÓ D'ENTRADA */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="btn-3d bg-white dark:bg-zinc-800 p-3 rounded-2xl border-2 border-b-4 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 transition-all"
          >
            🔙
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white tracking-tight">
              El teu Personatge
            </h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
              Configuració del perfil
            </p>
          </div>
        </div>

        {/* Decoració flotant (opcional) */}
        <div className="hidden md:block text-5xl animate-[float_4s_ease-in-out_infinite]">
          ⚙️
        </div>
      </div>
      
      {/* EL FORMULARI */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}