'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  inviteCode: string;
  roomName: string;
  className?: string; 
}

export function ShareRoomButton({ inviteCode, roomName, className }: Props) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => `${window.location.origin}/invite/${inviteCode}`;

  const handleShare = async () => {
    const url = getShareUrl();
    
    // ✅ TRADUCCIÓ DINÀMICA:
    // Substituïm el marcador '{name}' pel nom real de la sala
    const shareTitle = t.room.share_title.replace('{name}', roomName);
    const shareText = t.room.share_text.replace('{name}', roomName);

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: url,
    };

    // 1. INTENTAR OBRIR MENÚ NATIU (Mòbil)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return; 
      } catch (err) {
        console.log('Sharing cancelled or failed', err);
      }
    }

    // 2. FALLBACK: Copiar al porta-retalls (PC)
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) {
      console.log('Error copying:', err);
      alert(`${t.room.copy_error}: ${url}`); // ✅ Traducció error
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
          <span className="text-sm">{t.room.link_copied}</span> {/* ✅ Traducció */}
        </>
      ) : (
        <>
          <span className="text-lg group-hover:rotate-12 transition-transform">🔗</span>
          <span className="text-sm">{t.room.invite_cta}</span> {/* ✅ Traducció */}
        </>
      )}
    </button>
  );
}