'use client'

import { useTransition, useState } from 'react';
import { login } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/ui/AuthInput';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <--- Hook

export default function LoginPage() {
  const { t } = useLanguage(); // <--- Traduccions
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
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-100">

      {/* Elements decoratius */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[80px] pointer-events-none"></div>

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-300 hover:text-black dark:hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> {t.auth.back}
      </Link>

      <div className="w-full max-w-sm md:max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 relative z-10 flex flex-col justify-center">

        {/* HEADER */}
        <div className="text-center mb-4 md:mb-8 relative">
          <div className="text-6xl md:text-8xl mb-2 inline-block animate-wave filter drop-shadow-lg">
            👋
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            {t.auth.login_title}
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-lg">
            {t.auth.login_subtitle}
          </p>
        </div>

        {/* TARGETA */}
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] px-6 py-6 md:p-8 border-4 border-white dark:border-zinc-800 shadow-xl relative overflow-hidden">

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
                <Link href="#" className="text-[10px] font-bold text-gray-400 hover:text-blue-500 uppercase tracking-wider p-1">
                  {t.auth.forgot_password}
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-2 md:p-4 rounded-xl text-xs md:text-sm font-bold text-center border-2 border-red-100 animate-in shake">
                🚫 {error}
              </div>
            )}

            <Button
              className="w-full py-3 md:py-5 text-lg md:text-xl rounded-xl md:rounded-2xl bg-blue-600 border-blue-800 hover:bg-blue-500 shadow-lg text-white transition-all hover:-translate-y-1 mt-2"
              type="submit"
              isLoading={isPending}
            >
              {t.auth.login_btn}
            </Button>
          </form>

          <div className="mt-4 md:mt-8 text-center pt-4 border-t border-gray-100 dark:border-zinc-800">
            <p className="text-xs md:text-sm font-bold text-gray-400">
              {t.auth.no_account}{' '}
              <Link href="/register" className="text-blue-500 hover:underline decoration-2 underline-offset-4 decoration-wavy ml-1">
                {t.auth.register_link}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}