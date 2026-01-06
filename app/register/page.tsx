'use client'

import { useTransition, useState, Suspense } from 'react'; // ✅ Importem Suspense
import { signup } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/ui/AuthInput';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSearchParams } from 'next/navigation';

// 1️⃣ Component intern amb la lògica
function RegisterForm() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

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
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-white">

      {/* Elements decoratius */}
      <div className="absolute top-1/4 right-10 text-4xl animate-pulse opacity-20 select-none grayscale">✨</div>
      <div className="absolute bottom-1/4 left-10 text-4xl animate-pulse opacity-20 select-none delay-700 grayscale">🎉</div>

      {/* ENRERE */}
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-500 hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> {t.auth.back}
      </Link>

      <div className="w-full max-w-sm md:max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 relative z-10 flex flex-col justify-center">

        {/* HEADER */}
        <div className="text-center mb-4 md:mb-8 relative">
          <div className="text-6xl md:text-8xl mb-2 inline-block animate-float-fast filter drop-shadow-lg">
            🚀
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {t.auth.register_title}
          </h1>
          <p className="text-gray-400 font-medium text-sm md:text-lg">
            {t.auth.register_subtitle}
          </p>
        </div>

        {/* TARGETA */}
        <div className="bg-zinc-900/70 backdrop-blur-xl rounded-4xl px-6 py-6 md:p-8 border-4 border-zinc-800 shadow-2xl relative overflow-hidden group">

          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-green-400 to-emerald-500"></div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6 relative z-10">
            <input type="hidden" name="next" value={next} />
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
              <div className="bg-red-900/20 text-red-400 p-2 md:p-4 rounded-xl text-xs md:text-sm font-bold text-center border-2 border-red-900/50 animate-shake">
                🚫 {error}
              </div>
            )}

            <Button
              className="w-full py-3 md:py-5 text-lg md:text-xl rounded-xl md:rounded-2xl mt-2 shadow-xl shadow-emerald-900/20"
              type="submit"
              variant="primary"
              isLoading={isPending}
            >
              {t.auth.register_btn}
            </Button>
          </form>

          <div className="mt-4 md:mt-8 text-center pt-4 border-t border-zinc-800">
            <p className="text-xs md:text-sm font-bold text-gray-400">
              {t.auth.has_account}{' '}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="text-emerald-500 hover:text-emerald-400 transition-colors hover:underline decoration-2 underline-offset-4 decoration-wavy ml-1"
              >
                {t.auth.login_link}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2️⃣ Component principal exportat amb el Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Thinking...</div>}>
      <RegisterForm />
    </Suspense>
  );
}