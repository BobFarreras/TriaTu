'use client'

import { HelpCircle } from 'lucide-react';
import { useOnboarding, TourStep } from './OnboardingContext';
import { motion } from 'framer-motion';

interface Props {
  tourId: string; // ✅ NOVA PROP OBLIGATÒRIA
  steps: TourStep[];
  className?: string;
  onClick?: () => void;
}

export function TourTrigger({ steps, className, tourId, onClick }: Props) {
  const { startTour } = useOnboarding();
  const isE2E = process.env.NEXT_PUBLIC_E2E === 'true';

  if (isE2E) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
        // ✅ { force: true } ignora el localStorage i l'activa igualment
        startTour(tourId, steps, { force: true }); // ✅ Passem l'ID
      }}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full 
        bg-slate-800 border border-slate-700 text-slate-400 
        hover:text-purple-400 hover:border-purple-500/50 hover:bg-slate-800/80
        transition-all shadow-lg z-50
        ${className}
      `}
      title="Repetir la Guia 🆘"
    >
      {/* Pots posar un emoji si ho prefereixes: <span>🆘</span> */}
      <HelpCircle size={20} />
    </motion.button>
  );
}
