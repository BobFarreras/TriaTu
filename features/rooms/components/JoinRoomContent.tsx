'use client'

import { useState, useTransition } from 'react';
import { joinRoomAction } from '@/app/actions/room-actions';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <---

export function JoinRoomContent({ userId }: { userId: string }) {
  const { t } = useLanguage(); // <---
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const roomId = formData.get('roomId')?.toString();
    
    if (!roomId) {
        setError(t.join_room.err_code_required); // <--- Traducció
        return;
    }

    startTransition(async () => {
      const res = await joinRoomAction(roomId, userId);
      if (res.error) {
        setError(res.error);
      } else {
        router.push(`/rooms/${roomId}`);
      }
    });
  };

  // Nota: Aquest component sembla dissenyat per anar dins d'un layout més gran o el seu propi wrapper.
  // Aquí tradueixo els textos interns.

  return (
    <div className="relative group w-full max-w-md mx-auto">
        <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-orange-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[2.5rem] p-2 border-4 border-yellow-400 dark:border-yellow-600 shadow-2xl">
            
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-white dark:bg-black rounded-full z-20 border-r-4 border-yellow-400 dark:border-yellow-600 box-content"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white dark:bg-black rounded-full z-20 border-l-4 border-yellow-400 dark:border-yellow-600 box-content"></div>

            <div className="bg-yellow-50/50 dark:bg-black/40 rounded-4xl p-6 md:p-8 border-2 border-dashed border-yellow-200 dark:border-yellow-800/50 flex flex-col gap-4">
                
                <div className="text-center mb-2">
                    <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{t.join_room.hero_title}</h2>
                    <p className="text-xs font-bold text-gray-400">{t.join_room.hero_subtitle}</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2 group/input">
                        <label className="text-xs font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-500 ml-2 group-focus-within/input:text-yellow-700 transition-colors">
                            {t.join_room.label_code}
                        </label>
                        <input 
                            name="roomId" 
                            type="text" 
                            placeholder={t.join_room.placeholder_code} 
                            required 
                            autoFocus
                            className="
                                w-full px-5 py-5 rounded-2xl 
                                border-2 border-yellow-100 dark:border-yellow-900/30
                                bg-white dark:bg-black/50
                                focus:border-yellow-500 dark:focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 dark:focus:ring-yellow-900/20
                                outline-none font-mono font-bold text-lg md:text-xl text-gray-800 dark:text-gray-100 transition-all shadow-sm
                                placeholder:text-gray-300 dark:placeholder:text-zinc-700
                            "
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-2xl text-xs font-bold text-center border-2 border-red-100 animate-shake">
                            🚫 {error}
                        </div>
                    )}

                    <Button 
                        className="w-full py-5 text-xl rounded-2xl bg-yellow-500 border-yellow-700 hover:bg-yellow-400 shadow-xl shadow-yellow-200 dark:shadow-none text-white hover:-translate-y-1 transition-all" 
                        type="submit" 
                        isLoading={isPending}
                    >
                        {t.join_room.btn_join}
                    </Button>
                </form>
            </div>
        </div>
    </div>
  );
}