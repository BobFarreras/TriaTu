import { createClient } from '@/adapters/supabase/server';
import { joinRoomByCode } from '@/app/actions/joinRoom'; // La funció del Pas 2
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';

// ✅ CORRECCIÓ: Wrapper per satisfer TypeScript
function JoinButton({ code }: { code: string }) {

  // Creem una Server Action "inline" que fa de pont.
  // Aquesta funció crida la lògica, però no retorna l'objecte d'error al form directament.
  const handleJoin = async () => {
    'use server';
    await joinRoomByCode(code);
    // En no posar 'return', retorna Promise<void>, que és el que vol el <form>
  };

  return (
    <form action={handleJoin} className="w-full">
      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        🚀 Acceptar Invitació
      </button>
    </form>
  );
}
// 1. CANVI DE TIPUS: params ara és una Promise
interface PageProps {
  params: Promise<{ code: string }>;
}
export default async function InvitePage({ params }: PageProps) {
  const { code } = await params;

  console.log("🔍 [DEBUG] Buscant sala amb codi:", code); // <--- LOG 1

  const user = await getCurrentUser();

  if (!user) {
    console.log("👤 [DEBUG] Usuari no loguejat, redirigint...");
    redirect(`/login?next=/invite/${code}`);
  }

  const supabase = await createClient();
  // Busquem la sala
  const { data: room, error } = await supabase
    .from('decision_rooms')
    .select('id, name, invite_code') // Demana camps explícits
    .eq('invite_code', code)
    .single();

  // <--- LOGS XIVATOS START --->
  if (error) {
    console.error("❌ [DEBUG] Error Supabase:", error);
  } else if (!room) {
    console.error("❌ [DEBUG] Supabase no retorna error, però la sala és NULL (Segurament RLS)");
  } else {
    console.log("✅ [DEBUG] Sala trobada:", room);
  }


// Gestió d'errors (Codi malament)
if (!room) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#131f24] text-white p-4 text-center">
      <h1 className="text-4xl mb-4">🚫</h1>
      <h2 className="text-2xl font-bold mb-2">Invitació Invàlida</h2>
      <p className="text-gray-400 mb-6">Aquest codi no existeix o la sala s'ha esborrat.</p>
      <Link href="/dashboard" className="text-emerald-400 hover:underline">
        Tornar a l'Inici
      </Link>
    </div>
  );
}

return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#131f24] text-white p-4 relative">
    <div className="absolute inset-0 bg-gamified-pattern opacity-10 pointer-events-none" />

    <div className="z-10 bg-[#1f2e35] border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
        T'han convidat a
      </span>

      <h1 className="text-3xl font-black text-white mt-2 mb-6 leading-tight">
        {room.name}
      </h1>

      <div className="bg-black/20 p-4 rounded-lg mb-8">
        <p className="text-sm text-gray-300">
          Entraràs com a: <br />
          <span className="text-emerald-400 font-semibold">{user.email}</span>
        </p>
      </div>

      <JoinButton code={code} />

      <p className="mt-4 text-xs text-gray-500">
        En acceptar, t'uniràs a la llista de participants.
      </p>
    </div>
  </div>
);
}
