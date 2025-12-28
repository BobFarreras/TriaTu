'use client'

import { useState, useTransition } from 'react';
import { createRoomAction } from '@/app/actions/room-actions';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <---

export function CreateRoomContent({ userId }: { userId: string }) {
  const { t } = useLanguage(); // <---
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const roomName = formData.get('roomName')?.toString();

    if (!roomName || !roomName.trim()) {
        setError(t.create_room.err_name_required); // <--- Traducció
        return;
    }

    startTransition(async () => {
      const res = await createRoomAction(userId, roomName);
      
      if (!res.success || res.error) {
        setError(res.error || t.create_room.err_unknown); // <--- Traducció
      } else if (res.roomId) {
        router.push(`/rooms/${res.roomId}`);
      }
    });
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-purple-200">
      
      <div className="absolute top-20 left-10 text-7xl animate-[float_7s_ease-in-out_infinite] opacity-20 select-none">🧪</div>
      <div className="absolute bottom-20 right-10 text-7xl animate-[float_5s_ease-in-out_infinite_reverse] opacity-20 select-none">🏗️</div>

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-400 hover:text-black dark:hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        {t.create_room.back_cancel}
      </Link>

      <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-6 relative">
           <div className="text-7xl mb-2 inline-block animate-pulse filter drop-shadow-md">
             ✨
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">
             {t.create_room.hero_title}
           </h1>
           <p className="text-gray-500 font-bold text-sm md:text-base">
             {t.create_room.hero_subtitle}
           </p>
        </div>

        {/* TARGETA */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border-4 border-purple-200 dark:border-purple-900 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-purple-400 to-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

           <form action={handleSubmit} className="space-y-6 relative z-10">
             
             <div className="space-y-2 group/input">
               <label className="text-xs font-black uppercase tracking-wider text-purple-400 ml-2 group-focus-within/input:text-purple-600 transition-colors">
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
                   border-2 border-gray-100 dark:border-zinc-800 
                   bg-white dark:bg-black/50
                   focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20
                   outline-none font-black text-xl text-gray-800 dark:text-gray-100 transition-all shadow-sm
                   placeholder:text-gray-300 dark:placeholder:text-zinc-700 placeholder:font-bold
                 "
               />
             </div>

             {error && (
               <div className="bg-red-50 text-red-500 p-3 rounded-2xl text-xs font-bold text-center border-2 border-red-100 animate-shake">
                 🚫 {error}
               </div>
             )}

             <Button 
               className="w-full py-5 text-xl rounded-2xl bg-purple-600 border-purple-800 hover:bg-purple-500 shadow-xl shadow-purple-200 dark:shadow-none text-white hover:-translate-y-1 transition-all" 
               type="submit" 
               isLoading={isPending}
             >
               {t.create_room.btn_create}
             </Button>
           </form>

           <div className="mt-6 text-center">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               {t.create_room.host_info}
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}