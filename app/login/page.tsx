'use client'

import { useTransition, useState } from 'react';
import { login } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/ui/AuthInput';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-white">

      {/* Elements decoratius (Colors foscos fixos) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[80px] pointer-events-none"></div>

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-400 hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> {t.auth.back}
      </Link>

      <div className="w-full max-w-sm md:max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 relative z-10 flex flex-col justify-center">

        {/* HEADER */}
        <div className="text-center mb-4 md:mb-8 relative">
          <div className="text-6xl md:text-8xl mb-2 inline-block animate-wave filter drop-shadow-lg">
            👋
          </div>
          {/* Text blanc forçat */}
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {t.auth.login_title}
          </h1>
          <p className="text-gray-400 font-medium text-sm md:text-lg">
            {t.auth.login_subtitle}
          </p>
        </div>

        {/* TARGETA (Fons fosc translucent) */}
        <div className="bg-zinc-900/70 backdrop-blur-xl rounded-4xl px-6 py-6 md:p-8 border-4 border-zinc-800 shadow-xl relative overflow-hidden">

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6 relative z-10">
            <AuthInput
              name="email"
              type="email"
              label={t.auth.email_label}
              placeholder={t.auth.email_placeholder}
              required
            />

            <div className="space-y-1">
              <AuthInput
                name="password"
                type="password"
                label={t.auth.password_label}
                placeholder={t.auth.password_placeholder}
                required
              />
              <div className="text-right">
                <Link href="#" className="text-[10px] font-bold text-gray-400 hover:text-blue-400 uppercase tracking-wider p-1">
                  {t.auth.forgot_password}
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 text-red-400 p-2 md:p-4 rounded-xl text-xs md:text-sm font-bold text-center border-2 border-red-900/50 animate-shake">
                🚫 {error}
              </div>
            )}

            <Button
              className="w-full py-3 md:py-5 text-lg md:text-xl rounded-xl md:rounded-2xl bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-500 shadow-lg text-white transition-all hover:-translate-y-1 mt-2 active:border-b-0 active:translate-y-1"
              type="submit"
              isLoading={isPending}
            >
              {t.auth.login_btn}
            </Button>
          </form>

          <div className="mt-4 md:mt-8 text-center pt-4 border-t border-zinc-800">
            <p className="text-xs md:text-sm font-bold text-gray-400">
              {t.auth.no_account}{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 hover:underline decoration-2 underline-offset-4 decoration-wavy ml-1">
                {t.auth.register_link}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}