// src/components/ui/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  preferReferrer?: boolean;
  fallbackHref?: string;
  /**
   * Acció personalitzada (ex: tancar modal).
   * Si es defineix, bloqueja la navegació automàtica.
   */
  onAction?: () => void;
}

export function BackButton({
  href,
  label,
  className = "",
  preferReferrer = false,
  fallbackHref,
  onAction // 👈 Recuperem la prop del test
}: BackButtonProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const resolvedLabel = label ?? t.common.back;
  
  const storageKey = typeof window !== 'undefined'
    ? `back-origin:${window.location.pathname}`
    : null;

  const buttonStyles = `
    flex items-center justify-center gap-2 
    bg-slate-800 hover:bg-slate-700 
    text-white 
    border border-slate-700 hover:border-purple-500/50
    transition-colors shadow-lg
    cursor-pointer
    w-10 h-10 rounded-full
    sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:rounded-full
    ${className}
  `;

  const content = (
    <>
      <span className="text-xl sm:text-lg leading-none pb-1 sm:pb-0">🔙</span>
      <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">
        {resolvedLabel}
      </span>
    </>
  );

  // 1. Si tenim HREF explícit i NO tenim acció personalitzada, usem Link
  if (href && !onAction) {
    return (
      <Link href={href} passHref>
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

  // 2. Gestió del clic per a Router o Action
  const handleClick = () => {
    // CAS A: Prioritat absoluta a la funció personalitzada (el que busca el test)
    if (onAction) {
      onAction();
      return; // 🛑 ATUREM l'execució aquí, no fem router.back()
    }

    // CAS B: Lògica de navegació
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
    
    // CAS C: Default
    router.back();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={buttonStyles}
    >
      {content}
    </motion.button>
  );
}
