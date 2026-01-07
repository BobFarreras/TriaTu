// src/app/register/page.tsx
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/registre-form';

// Definim tipus per als props de la pàgina segons Next.js 13+
interface RegisterPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  // 1. Lògica segura d'extracció de paràmetres al servidor
  const nextParam = searchParams.next;
  const next = typeof nextParam === 'string' ? nextParam : '/dashboard';

  // Nota: Accedir a traduccions al servidor depèn de la teva config i18n.
  // Si uses un 'useLanguage' hook de client, els textos estàtics fora del form
  // (com el botó enrere) es poden passar com a props o moure dins del form.
  // Aquí assumeixo text estàtic o que el component wrapper gestiona el context si és un layout.
  // Per simplificar, posaré text estàtic aquí o pots moure el botó 'Enrere' dins del RegisterForm si vols que sigui traduïble via hook.
  
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-white">

      {/* Elements decoratius de fons */}
      <div className="absolute top-1/4 right-10 text-4xl animate-pulse opacity-20 select-none grayscale">✨</div>
      <div className="absolute bottom-1/4 left-10 text-4xl animate-pulse opacity-20 select-none delay-700 grayscale">🎉</div>

      {/* Botó Enrere (Si necessites traducció aquí, millor moure'l dins del component client o usar un servidor de traduccions) */}
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-500 hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> Enrere
      </Link>

      {/* Instanciació del component client */}
      <RegisterForm redirectTo={next} />
      
    </div>
  );
}