// src/app/login/page.tsx
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-from';
// Nota: Si no tens un component Server-Side per traduccions, el text estàtic del layout es pot gestionar aquí
// o passar el 't' com a prop si tens un diccionari carregat al servidor. 
// Assumirem text 'hardcoded' o un component wrapper per simplificar l'exemple del layout.

interface LoginPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  // 1. Lògica de Servidor: Validació i extracció de dades
  // Assegurem que és un string i gestionem el fallback al servidor
  const nextParam = searchParams.next;
  const next = typeof nextParam === 'string' ? nextParam : '/dashboard';

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-white">
      
      {/* Elements decoratius i Layout global de la pàgina */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[80px] pointer-events-none"></div>

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-400 hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> Tornar
      </Link>

      {/* 2. Instanciació del component de client */}
      {/* Passem les dades netes. El component no ha de pensar d'on venen. */}
      <LoginForm redirectTo={next} />
      
    </div>
  );
}