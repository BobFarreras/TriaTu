'use client';
import { useRouter } from 'next/navigation'; // 👈 Importem el router
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BackButtonProps {
  href?: string; // Ara és opcional de veritat
  label?: string;
  className?: string;
  preferReferrer?: boolean;
  fallbackHref?: string;
}

export function BackButton({
  href,
  label = "Tornar",
  className = "",
  preferReferrer = false,
  fallbackHref
}: BackButtonProps) {
  const router = useRouter();
  const storageKey = typeof window !== 'undefined'
    ? `back-origin:${window.location.pathname}`
    : null;

  // Definim els estils comuns per no repetir codi
  const buttonStyles = `
    flex items-center justify-center gap-2 
    bg-slate-800 hover:bg-slate-700 
    text-white 
    border border-slate-700 hover:border-purple-500/50
    transition-colors shadow-lg
    cursor-pointer
    
    /* MÒBIL: Rodó i petit */
    w-10 h-10 rounded-full
    
    /* ESCRIPTORI: Allargat i amb text */
    sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:rounded-full
    
    ${className}
  `;

  // Contingut visual del botó (Icona + Text)
  const content = (
    <>
      <span className="text-xl sm:text-lg leading-none pb-1 sm:pb-0">🔙</span>
      <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">
        {label}
      </span>
    </>
  );

  // CAS 1: Si tenim una ruta específica (href), fem servir Link (millor per SEO i prefetching)
  if (href) {
    return (
      <Link href={href}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={buttonStyles}
        >
          {content}
        </motion.div>
      </Link>
    );
  }


  // CAS 2: Si volem tornar a l'origen (fora d'aquesta ruta), usem el referrer guardat
  return (
    <motion.button
      type="button"
      onClick={() => {
        if (preferReferrer && typeof window !== "undefined" && storageKey) {
          const storedOrigin = sessionStorage.getItem(storageKey);
          if (storedOrigin) {
            router.push(storedOrigin);
            return;
          }
          if (fallbackHref) {
            router.push(fallbackHref);
            return;
          }
        }
        router.back();
      }} // back navigation
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={buttonStyles}
    >
      {content}
    </motion.button>
  );
}
