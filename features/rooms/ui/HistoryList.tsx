'use client'

import { useState } from 'react';
import { ChevronDown, Trophy, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <---

interface HistoryItem {
  choice: string;
  reason: string;
  date: string;
}

const getFunStyle = (text: string) => {
  const colors = [
    'from-yellow-400 to-orange-500 shadow-orange-200',
    'from-blue-400 to-cyan-500 shadow-cyan-200',
    'from-purple-400 to-pink-500 shadow-pink-200',
    'from-green-400 to-emerald-500 shadow-emerald-200',
  ];
  const index = text.length % colors.length;
  return colors[index];
};

export function HistoryList({ history }: { history: HistoryItem[] }) {
  const { t } = useLanguage(); // <---
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 dark:bg-zinc-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800 opacity-60">
        <div className="text-3xl mb-2 grayscale opacity-50">🏆</div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {t.room.trophy_empty_title}
        </p>
      </div>
    );
  }

  const sortedHistory = [...history].reverse();
  const visibleHistory = isExpanded ? sortedHistory : sortedHistory.slice(0, visibleCount);
  const hasMore = sortedHistory.length > visibleCount;
  const remainingCount = sortedHistory.length - visibleCount;

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-4xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      
      <button 
        className="w-full px-6 py-4 flex justify-between items-center group hover:bg-white/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors flex items-center gap-2">
          <Trophy size={14} className="text-yellow-500" /> 
          {t.room.wall_fame}
          <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px]">
            {history.length}
          </span>
        </h3>
        <div className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
           <ChevronDown size={20}/>
        </div>
      </button>

      <div className={`px-4 pb-4 space-y-3 transition-all duration-500 ${isExpanded ? 'max-h-[60vh] overflow-y-auto custom-scrollbar' : ''}`}>
        {visibleHistory.map((item, index) => {
           const gradientClass = getFunStyle(item.choice);
           
           return (
            <div 
              key={`${item.date}-${index}`} 
              className="group relative bg-white dark:bg-black rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge visual "WINNER" */}
              <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full bg-linear-to-br ${gradientClass} flex items-center justify-center text-white text-xs border-2 border-white dark:border-zinc-900 shadow-lg z-10`}>
                <Sparkles size={14} />
              </div>

              <div className="pl-6">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-lg text-gray-800 dark:text-gray-100 leading-tight">
                    {item.choice}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">
                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-zinc-900/50 p-2 rounded-lg border border-gray-100 dark:border-zinc-800/50">
                  "{item.reason}"
                </p>
              </div>
            </div>
           );
        })}

        {!isExpanded && hasMore && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full py-3 mt-2 text-xs font-black text-gray-400 hover:text-purple-500 bg-gray-50 hover:bg-purple-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all border border-dashed border-gray-200 hover:border-purple-200"
          >
            {/* Truc per reemplaçar {count} al text */}
            {t.room.view_more.replace('{count}', String(remainingCount))}
          </button>
        )}
      </div>
    </div>
  );
}