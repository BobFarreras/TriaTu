// =================== FILE: app/page.tsx ===================
import { LandingHero } from '@/features/landing/LandingHero';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { createClient } from '@/adapters/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect('/dashboard'); // O a /rooms/create, on prefereixis

  return (
    // Fons vibrant però net (el patró de punts ve del body a layout.tsx)
    <main className="min-h-screen relative overflow-hidden">
      
      {/* Navbar Flotant */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-green-500 rounded-lg rotate-3 shadow-sm"></div>
           <span className="font-black text-xl tracking-tighter text-gray-800 dark:text-white">DecideAI</span>
        </div>
        <LanguageSwitcher />
      </nav>

      <LandingHero />
      
    </main>
  );
}