'use client';

import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'error' | 'success';
  title: string;
  message: string;
}

export function FeedbackModal({ isOpen, onClose, type, title, message }: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop fosc */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999"
          />
          
          {/* Modal al centre */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10000 w-full max-w-sm px-4"
          >
            <div className={`relative overflow-hidden rounded-2xl border p-6 shadow-2xl ${
                type === 'error' 
                ? 'bg-zinc-900 border-red-500/30 text-red-100' 
                : 'bg-zinc-900 border-emerald-500/30 text-emerald-100'
              }`}>
              <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-3 rounded-full mb-1 ${type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {type === 'error' ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{message}</p>
                <button onClick={onClose} className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm transition-transform active:scale-95 ${
                    type === 'error' 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                  }`}>
                  Entesos
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}