'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BackButtonProps {
  href?: string; // Opcional: Si vols forçar que vagi a una pàgina concreta
  label?: string; // Opcional: Per si vols posar "Cancel·lar" en lloc de "Tornar"
  className?: string;
}

export function BackButton({ href, label = "Tornar", className = "" }: BackButtonProps) {
  const router = useRouter();

  const style = `
    inline-flex items-center gap-2 
    text-slate-400 hover:text-white 
    bg-slate-800/50 hover:bg-slate-800 
    border border-slate-700 hover:border-slate-600
    px-4 py-2 rounded-xl transition-all 
    text-sm font-bold backdrop-blur-sm
    active:scale-95
    ${className}
  `;

  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );

  // Si tenim un destí fix, usem Link (és millor per SEO i pre-fetching)
  if (href) {
    return (
      <Link href={href} className={style}>
        {icon}
        {label}
      </Link>
    );
  }

  // Si no, usem l'historial del navegador
  return (
    <button onClick={() => router.back()} className={style}>
      {icon}
      {label}
    </button>
  );
}