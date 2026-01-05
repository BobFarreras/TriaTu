import { LandingHero } from '@/features/landing/LandingHero';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { createClient } from '@/adapters/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/icon1.png'; 
import { NavbarInstallButton } from '@/features/landing/components/NavbarInstallbutton';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect('/dashboard'); 

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* Navbar Flotant */}
      {/* Hem canviat p-6 a p-4 en mòbils per guanyar espai */}
      <nav className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-50">
        
        {/* GRUP ESQUERRA: LOGO + NOM */}
        <div className="flex items-center gap-2 md:gap-3">
           <Image 
             src={logo} 
             alt="Logo TriaTu" 
             width={40} 
             height={40} 
             className="rounded-xl w-8 h-8 md:w-11 md:h-11 shadow-lg" // Mida dinàmica
           />
           <span className="font-black text-lg md:text-xl tracking-tighter text-white drop-shadow-md">
             TriaTu
           </span>
        </div>
        
        {/* GRUP DRETA: ACCIONS (Instal·lar + Idioma) */}
        <div className="flex items-center gap-2 md:gap-4">
            {/* El botó s'adapta sol gràcies al component que hem fet abans */}
            <NavbarInstallButton />
            
            {/* Separador vertical subtil (opcional) */}
            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
            
            <LanguageSwitcher />
        </div>

      </nav>

      <LandingHero />
      
    </main>
  );
}