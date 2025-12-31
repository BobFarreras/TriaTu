'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function CreateRecipeButton() {
  // JA NO NECESSITEM ESTAT NI MODAL
  // Simplement naveguem a la pàgina del Wizard

  return (
    <Link href="/recipes/create">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        // Nota: Assegura't de fer servir 'bg-gradient-to-r' en lloc de 'bg-linear-to-r' si uses Tailwind standard
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-xl shadow-purple-900/40 flex items-center justify-center border-2 border-white/20"
      >
        <Plus size={32} />
      </motion.button>
    </Link>
  );
}