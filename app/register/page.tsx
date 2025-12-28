'use client'

import { useTransition, useState } from 'react';
import { signup } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/ui/AuthInput';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <--- Hook

export default function RegisterPage() {
  const { t } = useLanguage(); // <--- Traduccions
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-100">
      
      {/* Elements decoratius */}
      <div className="absolute top-1/4 right-10 text-4xl animate-pulse opacity-20 select-none">✨</div>
      <div className="absolute bottom-1/4 left-10 text-4xl animate-pulse opacity-20 select-none delay-700">🎉</div>

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-400 hover:text-black dark:hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> {t.auth.back}
      </Link>

      <div className="w-full max-w-sm md:max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 relative z-10 flex flex-col justify-center">
        
        {/* HEADER */}
        <div className="text-center mb-4 md:mb-8 relative">
           <div className="text-6xl md:text-8xl mb-2 inline-block animate-float-fast filter drop-shadow-lg">
             🚀
           </div>
           <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
             {t.auth.register_title}
           </h1>
           <p className="text-gray-500 font-medium text-sm md:text-lg">
             {t.auth.register_subtitle}
           </p>
        </div>

        {/* TARGETA */}
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] px-6 py-6 md:p-8 border-4 border-white dark:border-zinc-800 shadow-2xl relative overflow-hidden group">
           
           {/* Detall verd */}
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>

           <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6 relative z-10">
             
             <AuthInput 
               name="email" 
               type="email" 
               label={t.auth.email_label} 
               placeholder={t.auth.email_placeholder} 
               required 
             />
             
             <AuthInput 
               name="password" 
               type="password" 
               label={t.auth.password_label} 
               placeholder={t.auth.password_min} 
               required 
               minLength={6} 
             />

             {error && (
               <div className="bg-red-50 text-red-500 p-2 md:p-4 rounded-xl text-xs md:text-sm font-bold text-center border-2 border-red-100 animate-in shake">
                 🚫 {error}
               </div>
             )}

             <Button 
               className="w-full py-3 md:py-5 text-lg md:text-xl rounded-xl md:rounded-2xl bg-black dark:bg-white text-white dark:text-black border-2 border-transparent hover:border-green-500 hover:text-green-500 transition-all hover:-translate-y-1 shadow-xl mt-2" 
               type="submit" 
               isLoading={isPending}
             >
               {t.auth.register_btn}
             </Button>
           </form>

           <div className="mt-4 md:mt-8 text-center pt-4 border-t border-gray-100 dark:border-zinc-800">
             <p className="text-xs md:text-sm font-bold text-gray-400">
               {t.auth.has_account}{' '}
               <Link href="/login" className="text-green-600 hover:text-green-700 transition-colors hover:underline decoration-2 underline-offset-4 decoration-wavy ml-1">
                 {t.auth.login_link}
               </Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}