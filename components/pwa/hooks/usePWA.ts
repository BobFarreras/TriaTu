// src/hooks/usePWA.ts
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export type Platform = 'ios' | 'android' | 'desktop' | null;

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Detecció inicial (Asíncrona per evitar errors de React)
    const timer = setTimeout(() => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;

      setIsStandalone(isStandaloneMode);

      // Detectem la plataforma visualment
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setPlatform('ios');
      } else if (/android/.test(userAgent)) {
        setPlatform('android');
      } else {
        setPlatform('desktop');
      }
      // ❌ ESBORRA TOT AQUEST BLOC:
      /*
      if (process.env.NODE_ENV === 'development') {
        console.log("🔧 DEV MODE: Forçant visibilitat del botó PWA");
        setIsInstallable(true);
        setPlatform('desktop'); 
      }
      */

    }, 0);

    // 2. Capturem l'event natiu (Android / Desktop Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      // Si salta aquest event, és que el navegador permet instal·lació directa
      // (Pot ser Android o Desktop, l'userAgent ja ho haurà definit a dalt)
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    // A. Instal·lació Nativa (Android / Desktop)
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    }
    // B. Instruccions Manuals (iOS)
    else if (platform === 'ios') {
      alert("📲 Per instal·lar a l'iPhone:\n1. Prem el botó 'Compartir' (quadrat amb fletxa)\n2. Baixa i selecciona 'Afegir a la pantalla d'inici'");
    }
  };

  return { isInstallable, platform, isStandalone, installApp };
}