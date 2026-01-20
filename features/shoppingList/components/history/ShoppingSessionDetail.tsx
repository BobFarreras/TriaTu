// ARXIU: src/features/shoppingList/components/history/ShoppingSessionDetail.tsx
'use client';

import { motion } from 'framer-motion';
import { HistorySession } from '../ShoppingHistory';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

interface Props {
    session: HistorySession;
    onClose: () => void;
}

export function ShoppingSessionDetail({ session, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()} 
                className="bg-white text-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
                {/* HEADER TICKET */}
                <div className="bg-slate-100 p-6 border-b border-dashed border-slate-300 text-center">
                    <div className="text-4xl mb-2">🧾</div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-slate-700">Rebut de Compra</h2>
                    <p className="text-sm text-slate-500 font-mono mt-1">
                        {format(session.createdAt, "d MMMM yyyy, HH:mm", { locale: ca })}
                    </p>
                </div>

                {/* LLISTA ITEMS */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {session.itemsSnapshot.map((item, idx) => {
                        // ✅ Lògica visual: Té imatge guardada?
                        const hasImage = !!item.productImage;

                        return (
                            <div key={idx} className="flex justify-between items-start text-sm">
                                <div className="flex gap-3 items-center min-w-0">
                                    {/* CONTENIDOR IMATGE/EMOJI */}
                                    <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                                        {hasImage ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img 
                                                src={item.productImage} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain p-0.5" 
                                            />
                                        ) : (
                                            <span className="text-xl leading-none">{item.emoji || '📦'}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-800 line-clamp-2 leading-tight">
                                            {item.name}
                                        </span>
                                        <span className="text-slate-500 text-xs font-mono mt-0.5">
                                            {item.quantity}{item.unit} {item.estimatedCost ? `x ${item.estimatedCost.toFixed(2)}€` : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="font-mono font-bold text-slate-700 ml-2">
                                    {item.estimatedCost 
                                        ? (item.estimatedCost * item.quantity).toFixed(2) + '€'
                                        : '-'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER TOTALS */}
                <div className="bg-slate-900 text-white p-6 pb-8">
                    <div className="flex justify-between items-center text-slate-400 text-sm mb-2">
                        <span>Items totals</span>
                        <span className="font-mono">{session.itemCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-3xl font-black pt-3 border-t border-slate-700/50">
                        <span>TOTAL</span>
                        <span className="text-emerald-400">{session.totalCost.toFixed(2)}€</span>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="w-full mt-5 bg-slate-800 hover:bg-slate-700 py-3.5 rounded-xl font-bold transition-colors text-slate-200"
                    >
                        Tancar Rebut
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
