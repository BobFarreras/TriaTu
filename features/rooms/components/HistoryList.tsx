'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { HistoryItem } from '../logic/history-types'; // Importem tipus compartits
import { HistoryHeader } from './history/HistoryHeader'; // Component extret
import { HistoryDetails } from './history/HistoryDetails'; // Component extret

function HistoryItemCard({ item, index }: { item: HistoryItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
        className="group relative bg-zinc-900/90 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-0.5" 
        style={{ animationDelay: `${index * 100}ms` }}
    >
      <HistoryHeader item={item} isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      {isOpen && <HistoryDetails item={item} />}
    </div>
  );
}

export function HistoryList({ history }: { history: HistoryItem[] }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleHistory = isExpanded ? history : history.slice(0, 3);
  const remainingCount = Math.max(0, history.length - 3);

  const showMoreText = t.room.history.show_more.replace('{count}', remainingCount.toString());

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-zinc-900/30 rounded-4xl border-2 border-dashed border-zinc-800/50">
        <div className="text-5xl mb-4 grayscale opacity-30">🏆</div>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{t.room.history.empty}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-2 shadow-2xl">
      <div className="px-6 py-5 flex justify-between items-center">
        <h3 className="font-black text-sm uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-600" /> {t.room.history.title}
        </h3>
        <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold">{history.length}</span>
      </div>
      <div className="px-2 pb-2 space-y-3">
        {visibleHistory.map((item, index) => (
            <HistoryItemCard key={`${item.date}-${index}`} item={item} index={index} />
        ))}
        {!isExpanded && remainingCount > 0 && (
          <button onClick={() => setIsExpanded(true)} className="w-full py-4 text-xs font-black text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all border border-dashed border-zinc-800 hover:border-zinc-600">
            {showMoreText}
          </button>
        )}
      </div>
    </div>
  );
}