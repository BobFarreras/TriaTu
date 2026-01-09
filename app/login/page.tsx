// src/app/login/page.tsx
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-from';

interface LoginPageProps {
  // 1. Canviem el tipus a Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 2. Afegim 'async' al component
export default async function LoginPage({ searchParams }: LoginPageProps) {
  
  // 3. Fem AWAIT per obtenir l'objecte real
  const resolvedSearchParams = await searchParams;

  // Ara ja podem accedir a les propietats com abans
  const nextParam = resolvedSearchParams.next;
  const next = typeof nextParam === 'string' ? nextParam : '/dashboard';

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-white">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[80px] pointer-events-none"></div>

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 text-xs md:text-sm font-black text-gray-400 hover:text-white transition-colors z-20 flex items-center gap-1 p-2">
        <span>←</span> Tornar
      </Link>

      <LoginForm redirectTo={next} />
      
    </div>
  );
}