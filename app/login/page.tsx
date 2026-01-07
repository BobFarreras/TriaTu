'use client'

import { useTransition, useState, Suspense } from 'react'; // ✅ Importem Suspense
import { login } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/ui/AuthInput';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSearchParams } from 'next/navigation';

// 1️⃣ Component intern amb tota la teva lògica
function LoginForm() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  // ✅ Decodifiquem per seguretat
  const next = decodeURIComponent(searchParams.get('next') || '/dashboard');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 🛑 Atura el comportament natiu, però el method="POST" és la xarxa de seguretat
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-white">

      {/* Elements decoratius */}
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
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {t.auth.login_title}
          </h1>
          <p className="text-gray-400 font-medium text-sm md:text-lg">
            {t.auth.login_subtitle}
          </p>
        </div>

        {/* TARGETA */}
        <div className="bg-zinc-900/70 backdrop-blur-xl rounded-4xl px-6 py-6 md:p-8 border-4 border-zinc-800 shadow-xl relative overflow-hidden">

          {/* ⚠️ SEGURETAT: method="POST" és obligatori. 
            Si JS falla, això evita que la password vagi a la URL.
          */}
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">

            {/* Passem el next com a hidden input per recuperar-lo al server action */}
            <input type="hidden" name="next" value={next} />

            <AuthInput
              name="email"
              type="email"
              label={t.auth.email_label}
              placeholder="usuari@exemple.com"
              required
            />

            <div className="space-y-1">
              <AuthInput
                name="password"
                type="password"
                label={t.auth.password_label}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm font-bold text-center border border-red-500/20">
                🚫 {error}
              </div>
            )}

            <Button
              className="w-full py-4 text-lg font-bold rounded-xl shadow-lg mt-2"
              type="submit"
              isLoading={isPending}
            >
              {t.auth.login_btn}
            </Button>
          </form>

          <div className="mt-4 md:mt-8 text-center pt-4 border-t border-zinc-800">
            <p className="text-xs md:text-sm font-bold text-gray-400">
              {t.auth.no_account}{' '}
              <Link
                href={`/register?next=${encodeURIComponent(next)}`}
                className="text-blue-400 hover:text-blue-300 hover:underline decoration-2 underline-offset-4 decoration-wavy ml-1"
              >
                {t.auth.register_link}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2️⃣ Component principal exportat amb el Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Thinking...</div>}>
      <LoginForm />
    </Suspense>
  );
}