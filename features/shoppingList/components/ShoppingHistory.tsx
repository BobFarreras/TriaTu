// ARXIU: src/features/shoppingList/components/ShoppingHistory.tsx
'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ca, es, enUS } from 'date-fns/locale';
import { SnapshotItem } from '@/core/domain/entities/ShoppingSession';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingSessionDetail } from './history/ShoppingSessionDetail';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface HistorySession {
    id: string;
    createdAt: Date;
    totalCost: number;
    itemCount: number;
    itemsSnapshot: SnapshotItem[];
}

interface Props {
    sessions: HistorySession[];
}

export function ShoppingHistory({ sessions }: Props) {
    const { t, locale } = useLanguage();
    const [selectedSession, setSelectedSession] = useState<HistorySession | null>(null);
    const dateLocale = useMemo(() => {
        if (locale === 'es') return es;
        if (locale === 'en') return enUS;
        return ca;
    }, [locale]);
    
    // 1. Obtenir mesos disponibles únics
    const availableMonths = useMemo(() => {
        const months = new Set(sessions.map(s => format(s.createdAt, 'yyyy-MM')));
        return Array.from(months).sort().reverse(); // De més recent a més antic
    }, [sessions]);

    const [filterMonth, setFilterMonth] = useState<string>(availableMonths[0] || '');

    // 2. Filtrar sessions
    const filteredSessions = useMemo(() => {
        if (!filterMonth) return sessions;
        return sessions.filter(s => format(s.createdAt, 'yyyy-MM') === filterMonth);
    }, [sessions, filterMonth]);

    // 3. Calcular estadístiques del mes
    const monthlyTotal = filteredSessions.reduce((acc, s) => acc + s.totalCost, 0);

    if (sessions.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
                <div className="text-4xl mb-4">📜</div>
                <p className="text-slate-500">{t.shoppingList.history_empty}</p>
            </div>
        );
    }

    return (
        <>
            <AnimatePresence>
                {selectedSession && (
                    <ShoppingSessionDetail 
                        session={selectedSession} 
                        onClose={() => setSelectedSession(null)} 
                    />
                )}
            </AnimatePresence>

            <div className="space-y-6">
                
                {/* FILTRE I ESTADÍSTIQUES */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase">{t.shoppingList.history_month_label}</label>
                        <select 
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            data-testid="shopping-history-month"
                            className="bg-slate-950 border border-slate-800 text-white text-sm rounded-lg px-3 py-1 outline-none focus:border-emerald-500"
                        >
                            {availableMonths.map(m => {
                                const [year, month] = m.split('-');
                                const date = new Date(parseInt(year), parseInt(month) - 1);
                                return (
                                    <option key={m} value={m}>
                                        {format(date, 'MMMM yyyy', { locale: dateLocale })}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-slate-800">
                        <span className="text-slate-400 text-sm">{t.shoppingList.history_total_spend}</span>
                        <span className="text-2xl font-black text-emerald-400">
                            {monthlyTotal.toFixed(2)}€
                        </span>
                    </div>
                </div>

                {/* LLISTA DE SESSIONS */}
                <div className="space-y-3 pb-32">
                    {filteredSessions.map(session => (
                        <motion.div 
                            key={session.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedSession(session)}
                            data-testid="shopping-history-session"
                            data-session-id={session.id}
                            className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex flex-col">
                                    <span className="text-slate-200 font-bold capitalize flex items-center gap-2">
                                        {format(session.createdAt, "d MMM, EEEE", { locale: dateLocale })}
                                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {t.shoppingList.history_view_details}
                                        </span>
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {format(session.createdAt, "HH:mm")}h • {t.shoppingList.history_products_count.replace('{count}', String(session.itemCount))}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-400 font-black text-lg">
                                        {session.totalCost.toFixed(2)}€
                                    </div>
                                </div>
                            </div>
                            
                            {/* PREVIEW MINIATURA */}
                            <div className="flex gap-1 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                                {session.itemsSnapshot.slice(0, 7).map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="w-6 h-6 rounded bg-slate-950 flex items-center justify-center shrink-0 text-[10px] border border-slate-800" 
                                    >
                                        {item.emoji || '📦'}
                                    </div>
                                ))}
                                {session.itemsSnapshot.length > 7 && (
                                    <div className="w-6 h-6 rounded bg-slate-950 flex items-center justify-center shrink-0 text-[10px] border border-slate-800 text-slate-500">
                                        +
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
}
