'use client'

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ProfileForm } from './ProfileFrom'; // Assegura't del nom del fitxer
import { ArrowLeft } from 'lucide-react';

// ✅ Definim el tipus complet (Ha de coincidir amb initialData de la pàgina)
export type ProfileData = {
  username?: string;
  avatarEmoji?: string;
  foodPreferences: string[];
  exclusions: string[];
  socialTolerance: number;
};

interface Props {
    initialData: ProfileData;
    // Ja no necessitem 'username' com a prop separada, ve dins d'initialData
}

export function ProfileContent({ initialData }: Props) {
  const { t } = useLanguage();

  // Calculem què mostrar al Header
  const displayAvatar = initialData.avatarEmoji || '👨‍🍳';
  // Si té nom, el mostrem. Si no, mostrem "El teu Perfil" o l'email si el passéssim
  const displayName = initialData.username || (t.profile?.title || 'El teu Perfil');

  return (
    <div className="h-dvh w-full flex flex-col bg-[#131f24] bg-gamified-pattern selection:bg-purple-500 selection:text-white overflow-hidden relative">
      
      {/* DECORACIÓ DE FONS */}
      <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HEADER COMPACTE */}
      <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex items-center justify-between z-20 shrink-0">
         <div className="flex items-center gap-4">
            <Link 
                href="/dashboard" 
                className="group flex items-center justify-center w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-2xl border-2 border-zinc-700 hover:border-white transition-all shadow-sm"
            >
                <ArrowLeft size={20} className="text-gray-400 group-hover:text-white transition-colors group-hover:-translate-x-0.5" />
            </Link>
            
            <div>
                {/* Títol Dinàmic */}
                <h1 className="text-xl font-black text-white leading-none truncate max-w-[200px] md:max-w-md">
                    {displayName}
                </h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                    {t.profile?.title || 'CONFIGURACIÓ'}
                </p>
            </div>
         </div>

         {/* ✅ ICONA DINÀMICA: Mostrem l'avatar real animat */}
         <div className="hidden md:flex w-12 h-12 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-2xl items-center justify-center text-2xl shadow-lg animate-[float_4s_ease-in-out_infinite] backdrop-blur-md">
            {displayAvatar}
         </div>
      </header>

      {/* CONTINGUT PRINCIPAL */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 pb-24 overflow-y-auto no-scrollbar">
         <div className="animate-in slide-in-from-bottom-8 duration-700">
            <ProfileForm initialData={initialData} />
         </div>
      </div>

    </div>
  );
}