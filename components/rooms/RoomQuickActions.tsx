'use client'; // ✅ Necessari

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function RoomQuickActions() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* CREATE ROOM */}
      <Link 
        href="/rooms/create" 
        className="group relative w-full h-24 bg-blue-600 hover:bg-blue-500 rounded-2xl border-b-[6px] border-blue-800 active:border-b-0 active:translate-y-1.5 active:mt-1.5 transition-all overflow-hidden shadow-xl shadow-blue-900/20 flex items-center justify-between px-4"
      >
        <div className="z-10 flex flex-col items-start">
            <span className="text-[9px] font-black text-blue-200 bg-blue-800/30 px-1.5 py-0.5 rounded mb-1 tracking-wider">
                {t.social.actions.create_badge}
            </span>
            <h3 className="text-sm md:text-base font-black text-white leading-none tracking-tight">
                {t.social.actions.create_title}
            </h3>
        </div>
        <span className="text-3xl md:text-4xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🛋️</span>
      </Link>

      {/* JOIN ROOM */}
      <Link 
        href="/join" 
        className="group relative w-full h-24 bg-orange-500 hover:bg-orange-400 rounded-2xl border-b-[6px] border-orange-700 active:border-b-0 active:translate-y-1.5 active:mt-1.5 transition-all overflow-hidden shadow-xl shadow-orange-900/20 flex items-center justify-between px-4"
      >
        <div className="z-10 flex flex-col items-start">
            <span className="text-[9px] font-black text-orange-100 bg-orange-700/30 px-1.5 py-0.5 rounded mb-1 tracking-wider">
                {t.social.actions.join_badge}
            </span>
            <h3 className="text-sm md:text-base font-black text-white leading-none tracking-tight">
                {t.social.actions.join_title}
            </h3>
        </div>
        <span className="text-3xl md:text-4xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">🎫</span>
      </Link>
    </div>
  );
}