import { LandingHero } from '@/features/landing/components/LandingHero';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/icon1.png'; // Assegura't que aquesta ruta existeix
import { NavbarInstallButton } from '@/features/landing/components/NavbarInstallbutton';
import { getCurrentUser } from '@/lib/auth/session';
export default async function Home() {
  const user = await getCurrentUser();

  if (user) redirect('/dashboard'); 

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* Navbar Flotant */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
           <Image 
             src={logo} 
             alt="Logo TriaTu" 
             width={45} 
             height={45} 
             className="rounded-xl" // Opcional: per si vols arrodonir la icona
           />
           {/* TEXT: Forçat a text-white (Correcte) */}
           <span className="font-black text-xl tracking-tighter text-white">TriaTu</span>
        </div>
        <NavbarInstallButton />
        <LanguageSwitcher />
      </nav>

      <LandingHero />
      
    </main>
  );
}
