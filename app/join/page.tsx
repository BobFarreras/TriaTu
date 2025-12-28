// =================== FILE: app/join/page.tsx ===================
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { JoinRoomContent } from '@/features/rooms/ui/JoinRoomContent'; // <--- Nou component

export default async function JoinPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-yellow-200">
      
      {/* DECORACIÓ DE FONS */}
      <div className="absolute top-10 -right-5 text-8xl animate-[float_6s_ease-in-out_infinite] opacity-20 rotate-12 select-none">🎫</div>
      <div className="absolute bottom-20 left-[-20px] text-8xl animate-[float_5s_ease-in-out_infinite_reverse] opacity-20 -rotate-12 select-none">🍿</div>

      {/* BOTÓ ENRERE */}
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-400 hover:text-black dark:hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> CANCEL·LAR
      </Link>

      <div className="w-full max-w-md animate-in zoom-in-95 duration-500 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-6 relative">
           <div className="text-7xl mb-2 inline-block animate-bounce-click filter drop-shadow-md">
             🎟️
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">
             Tens un codi?
           </h1>
           <p className="text-gray-500 font-bold text-sm md:text-base">
             Introdueix l'ID per entrar a la festa.
           </p>
        </div>

        {/* COMPONENT DEL FORMULARI (TIQUET D'OR) */}
        <JoinRoomContent userId={user.id} />

        <div className="mt-8 text-center">
            <p className="text-xs font-black text-yellow-600/50 dark:text-yellow-500/50 uppercase tracking-widest animate-pulse">
                ADMET NOMÉS UNA PERSONA
            </p>
        </div>

      </div>
    </div>
  );
}