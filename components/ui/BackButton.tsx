'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href = "/dashboard", label = "Panell", className = "" }: BackButtonProps) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center justify-center gap-2 
          bg-slate-800 hover:bg-slate-700 
          text-white 
          border border-slate-700 hover:border-purple-500/50
          transition-colors shadow-lg
          
          /* MÒBIL: Rodó i petit */
          w-10 h-10 rounded-full
          
          /* ESCRIPTORI: Allargat i amb text */
          sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:rounded-full
          
          ${className}
        `}
      >
        <span className="text-xl sm:text-lg leading-none pb-1 sm:pb-0">🔙</span>
        
        {/* El text només es veu a partir de pantalles petites (sm) */}
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}