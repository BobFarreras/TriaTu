// src/features/dashboard/ui/NavigationPanel.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePWA, Platform } from '@/components/pwa/hooks/usePWA';

export function NavigationPanel() {
  const { t } = useLanguage();
  const { isInstallable, platform, isStandalone, installApp } = usePWA();

  const cardBaseClass = "group relative flex-1 min-h-[60px] w-full rounded-2xl border-b-[6px] active:border-b-0 active:translate-y-1.5 active:mt-1.5 transition-all overflow-hidden shadow-xl flex items-center px-4 md:px-6 justify-between";
  const showInstallCard = !isStandalone && (isInstallable || platform === 'ios');

  // CONFIGURACIÓ DINÀMICA DEL BOTÓ
  const getInstallUI = (plat: Platform) => {
    switch (plat) {
      case 'ios':
        return {
          text: "Instal·lar a iPhone",
          emoji: "🍎",
          badge: "iOS App",
          style: "bg-zinc-800 hover:bg-zinc-700 border-zinc-950 shadow-black/30",
          textStyle: "text-zinc-300 bg-zinc-950/50"
        };
      case 'android':
        return {
          text: "Instal·lar App",
          emoji: "🤖",
          badge: "Android APK",
          style: "bg-emerald-600 hover:bg-emerald-500 border-emerald-800 shadow-emerald-900/20",
          textStyle: "text-emerald-100 bg-emerald-800/40"
        };
      case 'desktop':
      default:
        return {
          text: "Instal·lar al PC",
          emoji: "💻",
          badge: "Desktop App",
          style: "bg-blue-600 hover:bg-blue-500 border-blue-800 shadow-blue-900/20",
          textStyle: "text-blue-100 bg-blue-800/40"
        };
    }
  };

  const ui = getInstallUI(platform);

  return (
    <div id="tour-dash-nav" className="flex flex-col gap-3 h-full animate-in slide-in-from-right-4 duration-700 delay-100 pb-1">

      {/* 1. CREAR SALA */}
      <Link id="tour-dash-create" href="/rooms/create" className={`${cardBaseClass} bg-blue-600 hover:bg-blue-500 border-blue-800 shadow-blue-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-blue-200 bg-blue-800/30 px-2 py-0.5 rounded w-fit mb-0.5">{t.dashboard.nav.multiplayer_badge}</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.create_room}</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🛋️</span>
      </Link>

      {/* 2. UNIR-SE */}
      <Link id="tour-dash-join" href="/join" className={`${cardBaseClass} bg-orange-500 hover:bg-orange-400 border-orange-700 shadow-orange-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-orange-100 bg-orange-700/30 px-2 py-0.5 rounded w-fit mb-0.5">{t.dashboard.nav.guest_badge}</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.join_room}</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">🎫</span>
      </Link>

      {/* 3. COMUNITAT DE RECEPTES -> ✅ ID NOU */}
      <Link id="tour-dash-recipes" href="/recipes" className={`${cardBaseClass} bg-pink-600 hover:bg-pink-500 border-pink-800 shadow-pink-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.nav.recipes}</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">🍲</span>
      </Link>

      {/* 4. RÀNQUING -> ✅ ID NOU */}
      <Link id="tour-dash-ranking" href="/ranking" className={`${cardBaseClass} bg-amber-500 hover:bg-amber-400 border-amber-700 shadow-amber-900/20`}>
        <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.nav.ranking}</h3>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">🏆</span>
      </Link>

      {/* 5. SALES -> ✅ ID NOU */}
      <Link id="tour-dash-rooms" href="/rooms" className={`${cardBaseClass} bg-indigo-600 hover:bg-indigo-500 border-indigo-800 shadow-indigo-900/20`}>
        <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.nav.my_rooms}</h3>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">🏘️</span>
      </Link>

      {/* 6. INVENTARI -> ✅ ID NOU */}
      <Link id="tour-dash-inventory" href="/inventory" className={`${cardBaseClass} bg-emerald-600 hover:bg-emerald-500 border-emerald-800 shadow-emerald-900/20`}>
        <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.nav.inventory}</h3>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:translate-x-1 transition-transform duration-300">📦</span>
      </Link>

      {/* 7. PERFIL -> ✅ ID NOU */}
      <Link id="tour-dash-profile" href="/profile" className={`${cardBaseClass} bg-zinc-700 hover:bg-zinc-600 border-zinc-900 shadow-black/20`}>
        <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.nav.profile}</h3>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">⚙️</span>
      </Link>

      

      {/* INSTAL·LACIÓ */}
      {showInstallCard && (
        <button
          onClick={installApp}
          className={`${cardBaseClass} ${ui.style}`}
        >
          <div className="z-10 flex flex-col justify-center text-left">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded w-fit mb-0.5 tracking-wider uppercase ${ui.textStyle}`}>
              {ui.badge}
            </span>
            <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">
              {ui.text}
            </h3>
          </div>
          <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
            {ui.emoji}
          </span>
        </button>
      )}

    </div>
  );
}