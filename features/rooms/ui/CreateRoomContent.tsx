'use client'

import { useState, useTransition } from 'react';
import { createRoomAction } from '@/app/actions/room-actions';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function CreateRoomContent({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const roomName = formData.get('roomName')?.toString();

    if (!roomName || !roomName.trim()) {
        setError(t.create_room.err_name_required);
        return;
    }

    startTransition(async () => {
      const res = await createRoomAction(userId, roomName);
      
      if (!res.success || res.error) {
        setError(res.error || t.create_room.err_unknown);
      } else if (res.roomId) {
        router.push(`/rooms/${res.roomId}`);
      }
    });
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500 selection:text-white">
      
      {/* FONS ANIMAT */}
      <div className="absolute top-20 left-10 text-7xl animate-[float_7s_ease-in-out_infinite] opacity-20 select-none grayscale">🧪</div>
      <div className="absolute bottom-20 right-10 text-7xl animate-[float_5s_ease-in-out_infinite_reverse] opacity-20 select-none grayscale">🏗️</div>

      {/* ENRERE */}
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-500 hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        {t.create_room.back_cancel}
      </Link>

      <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-6 relative">
           <div className="text-7xl mb-2 inline-block animate-pulse filter drop-shadow-md">
             ✨
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">
             {t.create_room.hero_title}
           </h1>
           <p className="text-gray-400 font-bold text-sm md:text-base">
             {t.create_room.hero_subtitle}
           </p>
        </div>

        {/* TARGETA (SEMPRE FOSCA) */}
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border-4 border-purple-900 shadow-2xl relative overflow-hidden group">
           
           {/* Línia de color superior */}
           <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-purple-500 to-pink-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

           <form action={handleSubmit} className="space-y-6 relative z-10">
             
             <div className="space-y-2 group/input">
               <label className="text-xs font-black uppercase tracking-wider text-purple-400 ml-2 group-focus-within/input:text-purple-300 transition-colors">
                 {t.create_room.label_name}
               </label>
               
               <input 
                 name="roomName" 
                 type="text" 
                 placeholder={t.create_room.placeholder_name} 
                 required 
                 autoFocus
                 className="
                   w-full px-5 py-5 rounded-2xl 
                   /* FONS I BORDES FOSCOS */
                   border-2 border-zinc-700 
                   bg-black/50
                   text-white
                   
                   /* ESTATS FOCUS */
                   focus:border-purple-500 focus:ring-4 focus:ring-purple-900/20
                   outline-none font-black text-xl transition-all shadow-sm
                   
                   /* PLACEHOLDER */
                   placeholder:text-zinc-600 placeholder:font-bold
                 "
               />
             </div>

             {/* ERROR BANNER (FOSC) */}
             {error && (
               <div className="bg-red-900/30 text-red-400 p-3 rounded-2xl text-xs font-bold text-center border-2 border-red-900/50 animate-shake">
                 🚫 {error}
               </div>
             )}

             {/* BOTÓ (LILA VIBRANT) */}
             <Button 
               className="w-full py-5 text-xl rounded-2xl bg-purple-600 border-purple-800 hover:bg-purple-500 shadow-xl shadow-purple-900/20 text-white hover:-translate-y-1 transition-all" 
               type="submit" 
               isLoading={isPending}
             >
               {t.create_room.btn_create}
             </Button>
           </form>

           <div className="mt-6 text-center">
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
               {t.create_room.host_info}
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}