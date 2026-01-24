'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RankingInfoDialog({ isOpen, onClose }: Props) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
            <h2 className="text-lg font-black text-white">{t.ranking.info_title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label={t.ranking.info_close}
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4 text-sm text-slate-300">
            <p className="text-slate-400">{t.ranking.info_desc}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
                <span className="font-semibold">{t.ranking.info_quality}</span>
                <span className="text-emerald-300 font-mono">+50</span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
                <span className="font-semibold">{t.ranking.info_pantry}</span>
                <span className="text-emerald-300 font-mono">+40</span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
                <span className="font-semibold">{t.ranking.info_community}</span>
                <span className="text-emerald-300 font-mono">+20</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-slate-200 font-bold">
              <span>{t.ranking.info_total}</span>
              <span className="font-mono">= {t.ranking.info_total_hint}</span>
            </div>
            <p className="text-xs text-slate-500">{t.ranking.info_note}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
