"use client";

import { useEffect, useState } from "react";

// 1. Definim la interfície per a l'event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 🛡️ SOLUCIÓ: Usem un setTimeout per trencar l'actualització síncrona.
    // Això calma el linter i evita problemes de "Hydration Mismatch".
    const timer = setTimeout(() => {
      // Ara estem segurs que estem al client i el primer render ha acabat.
      const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

      if (isStandaloneMode) setIsStandalone(true);
      if (isIosDevice) setIsIOS(true);
    }, 0);

    // Listener per a l'event d'instal·lació (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault(); // Evitem el banner natiu
      setDeferredPrompt(event);
      console.log("💾 PWA: Event d'instal·lació capturat");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer); // Neteja el timer si el component es desmunta ràpid
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Si ja està instal·lada, no mostrem res
  if (isStandalone) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // --- RENDERITZAT ---

  // A. Botó d'Instal·lació (Android / Desktop)
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-[#1f2e35] border border-emerald-500/30 p-4 rounded-xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-5">
        <div className="flex flex-col">
          <span className="font-bold text-white">Instal·la Triatu</span>
          <span className="text-xs text-gray-400">Accés ràpid i sense internet</span>
        </div>
        <button
          onClick={handleInstallClick}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Instal·lar
        </button>
      </div>
    );
  }

  // B. Instruccions iOS (iPhone / iPad)
  if (isIOS && !isStandalone) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-[#1f2e35] border border-blue-500/30 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📲</span>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-white">Instal·la a l'iPhone</span>
            <p className="text-xs text-gray-300">
              Prem <span className="font-bold">Compartir</span>{" "}
              <span className="inline-block bg-gray-700 px-1 rounded">⎋</span> i selecciona{" "}
              <span className="font-bold">"Afegir a l'inici"</span>.
            </p>
            <button 
                onClick={() => setIsIOS(false)} 
                className="text-xs text-blue-400 mt-2 text-left hover:underline"
            >
                Entesos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}