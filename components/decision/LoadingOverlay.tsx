// src/components/decision/ui/LoadingOverlay.tsx
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  isVisible: boolean;
  mode: 'FATE' | 'CHEF';
}

export function LoadingOverlay({ isVisible, mode }: Props) {
  const { t } = useLanguage();
  
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm animate-in fade-in duration-300 rounded-4xl">
      
      {/* Icona bategant */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
      >
        {mode === 'FATE' ? '🎲' : '👨‍🍳'}
      </motion.div>

      {/* Text animat */}
      <motion.h3 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-black text-white tracking-widest uppercase"
      >
        {mode === 'FATE' ? t.common.loading : t.decision.actions.generate_menu}
      </motion.h3>

      <p className="text-xs text-zinc-400 mt-2 font-mono">
        {mode === 'FATE' ? 'Consultant els astres...' : 'Analitzant el rebost...'}
      </p>

      {/* Barra de progrés falsa (dona sensació de velocitat) */}
      <div className="w-48 h-1 bg-zinc-800 rounded-full mt-6 overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-70"
        />
      </div>
    </div>
  );
}