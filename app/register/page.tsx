// src/app/register/page.tsx
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/registre-form';

// 1. Canviem el tipus a Promise (Next.js 15+)
interface RegisterPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 2. Afegim 'async' al component
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  
  // 3. Fem AWAIT per obtenir l'objecte real
  const resolvedSearchParams = await searchParams;
  
  const nextParam = resolvedSearchParams.next;
  const next = typeof nextParam === 'string' ? nextParam : '/dashboard';

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-white">

      {/* Elements decoratius de fons */}
      <div className="absolute top-1/4 right-10 text-4xl animate-pulse opacity-20 select-none grayscale">✨</div>
      <div className="absolute bottom-1/4 left-10 text-4xl animate-pulse opacity-20 select-none delay-700 grayscale">🎉</div>

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-500 hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> Enrere
      </Link>

      {/* Instanciació del component client */}
      <RegisterForm redirectTo={next} />
      
    </div>
  );
}