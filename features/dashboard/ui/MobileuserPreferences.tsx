'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { FOOD_DATA, EXCLUSION_DATA } from '@/core/constants/profile-data';

interface Props {
  foodPreferences: string[];
  exclusions: string[];
  className?: string;
}

interface UIItem {
    id: string;
    emoji: string;
    label: string;
}

const findItemData = (id: string, dataset: typeof FOOD_DATA): UIItem => {
  for (const category of dataset) {
    const item = category.items.find((i) => i.id === id);
    if (item) return { id: item.id, emoji: item.emoji, label: item.id };
  }
  return { id, emoji: '❓', label: id };
};

export function MobileUserPreferences({ foodPreferences, exclusions, className }: Props) {
  
  const preferencesList = useMemo(() => {
    const safe = Array.isArray(foodPreferences) ? foodPreferences : [];
    return safe.map(id => findItemData(id, FOOD_DATA));
  }, [foodPreferences]);

  const exclusionsList = useMemo(() => {
    const safe = Array.isArray(exclusions) ? exclusions : [];
    return safe.map(id => findItemData(id, EXCLUSION_DATA));
  }, [exclusions]);

  const hasData = preferencesList.length > 0 || exclusionsList.length > 0;

  return (
    <div className={`w-full flex items-center gap-2 py-1 px-1 ${className}`}>
      
      {/* BOTÓ PERFIL */}
      <Link 
        href="/profile"
        className="shrink-0 w-9 h-9 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center border-b-[3px] border-indigo-900 active:border-b-0 active:translate-y-[2px] transition-all shadow-lg shadow-indigo-900/20 z-10"
      >
        <span className="text-lg">😎</span>
      </Link>

      <div className="h-6 w-[1px] bg-zinc-700/50 shrink-0" />

      {/* CINTA SCROLLABLE */}
      <div className="flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mask-linear-fade">
        <div className="flex items-center gap-2 pr-4">
          
          {preferencesList.map((item) => (
            <MobileBubble key={item.id} {...item} variant="green" />
          ))}

          {preferencesList.length > 0 && exclusionsList.length > 0 && (
            <div className="h-1 w-1 rounded-full bg-zinc-600 shrink-0 mx-1" />
          )}

          {exclusionsList.map((item) => (
            <MobileBubble key={item.id} {...item} variant="red" />
          ))}

          {!hasData && (
             <span className="text-zinc-500 text-xs italic whitespace-nowrap pl-2">
               Sense dades...
             </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// BUBBLE MÒBIL AMB PORTAL TOOLTIP (CLICK)
// ----------------------------------------------------------------

function MobileBubble({ emoji, label, variant }: { emoji: string; label: string; variant: 'green' | 'red' }) {
    const [isActive, setIsActive] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const handleClick = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Calculem posició: A sota de l'element
            setCoords({ 
                top: rect.bottom + 8, // 8px de marge cap avall
                left: rect.left + (rect.width / 2) // Centrat horitzontalment
            });
            setIsActive(true);
            
            // Auto-amagar després de 2.5 segons
            setTimeout(() => setIsActive(false), 2500);
        }
    };
  
    const styles = {
      green: 'bg-green-900/20 border-green-500/30 text-green-400',
      red: 'bg-red-900/20 border-red-500/30 text-red-400',
    };
  
    return (
      <>
        <div 
            ref={triggerRef}
            onClick={handleClick}
            className={`
                shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-lg transition-transform active:scale-95
                ${styles[variant]}
                ${isActive ? 'ring-2 ring-white/20 scale-105' : ''}
            `}
        >
            {emoji}
        </div>

        {/* ETIQUETA FLOTANT (Portal) */}
        {isActive && (
            <MobilePortalTooltip top={coords.top} left={coords.left} label={label} />
        )}
      </>
    );
  }

function MobilePortalTooltip({ top, left, label }: { top: number, left: number, label: string }) {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div 
            className="fixed z-[9999] pointer-events-none flex flex-col items-center animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
            style={{ 
                top: top, 
                left: left, 
                transform: 'translateX(-50%)' // Centrat horitzontal respecte el punt
            }}
        >
            {/* Triangle cap amunt (apunta a la bombolla) */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-zinc-900 -mt-[6px] mb-[0px]"></div>
            
            {/* Text */}
            <div className="bg-zinc-900 border border-zinc-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap">
                {label}
            </div>
        </div>,
        document.body
    );
}