'use client';
import { usePWA, Platform } from '@/components/pwa/hooks/usePWA';

export function NavbarInstallButton() {
  const { isInstallable, platform, isStandalone, installApp } = usePWA();

  // Si ja tenen l'app o no es pot instal·lar (i no és iOS), no mostrem res
  if (isStandalone || (!isInstallable && platform !== 'ios')) return null;

  // CONFIGURACIÓ DE DISSENY SEGONS PLATAFORMA
  const getButtonStyle = (plat: Platform) => {
    switch (plat) {
      case 'ios':
        return {
          label: 'Instal·lar',
          icon: '', // Poma d'Apple (es veu bé en dispositius Apple) o usa '🍎'
          classes: 'bg-black/40 border-white/20 hover:bg-black/60 text-white',
        };
      case 'android':
        return {
          label: 'Instal·lar',
          icon: '🤖',
          classes: 'bg-emerald-500/20 border-emerald-400/30 hover:bg-emerald-500/40 text-emerald-100',
        };
      case 'desktop':
      default:
        return {
          label: 'Descarregar',
          icon: '💻',
          classes: 'bg-white/10 border-white/20 hover:bg-white/20 text-white',
        };
    }
  };

  const style = getButtonStyle(platform);

  return (
    <button
      onClick={installApp}
      className={`
        group relative flex items-center gap-2 
        px-3 py-2 rounded-full 
        backdrop-blur-md border shadow-lg 
        transition-all duration-300 active:scale-95
        ${style.classes}
      `}
    >
      {/* Icona: Sempre visible, amb una petita animació al hover */}
      <span className="text-lg leading-none group-hover:scale-110 transition-transform">
        {style.icon}
      </span>

      {/* Text: Només visible en pantalles grans (sm = 640px cap amunt) */}
      <span className="text-xs font-bold hidden sm:inline-block">
        {style.label}
      </span>
      
      {/* Indicador visual petit per mòbil (opcional, per donar context d'acció) */}
      <span className="sm:hidden text-[10px] font-bold opacity-80 uppercase tracking-widest">
        App
      </span>
    </button>
  );
}