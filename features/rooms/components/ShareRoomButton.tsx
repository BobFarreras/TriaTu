'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  inviteCode: string;
  roomName: string;
  className?: string; // Per poder estilitzar-lo des de fora
}

export function ShareRoomButton({ inviteCode, roomName, className }: Props) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Construïm la URL completa dinàmicament
  // window.location.origin ens dona "https://triatu.app" o "http://localhost:3000"
  const getShareUrl = () => `${window.location.origin}/invite/${inviteCode}`;

  const handleShare = async () => {
    const url = getShareUrl();
    const shareData = {
      title: `Uneix-te a "${roomName}"`,
      text: `Ei! Ajuda'm a decidir què fem a la sala "${roomName}". Entra aquí:`,
      url: url,
    };

    // 1. INTENTAR OBRIR MENÚ NATIU (Mòbil: WhatsApp, Telegram, etc.)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return; // Si funciona, acabem aquí
      } catch (err) {
        console.log('User cancelled sharing or error:', err);
      }
    }

    // 2. FALLBACK: Si som a l'ordinador, copiem al porta-retalls
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset del missatge després de 2s
    } catch (err) {
        console.log('Error al copiar:', err);
      alert('Error copiant: ' + url);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all active:scale-95 ${
        copied 
          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
          : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/20'
      } ${className}`}
    >
      {copied ? (
        <>
          <span>✅</span>
          <span className="text-sm">Link Copiat!</span>
        </>
      ) : (
        <>
          <span className="text-lg group-hover:rotate-12 transition-transform">🔗</span>
          <span className="text-sm">Invitar Amics</span>
        </>
      )}
    </button>
  );
}