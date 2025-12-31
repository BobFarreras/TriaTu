'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { FOOD_DATA, EXCLUSION_DATA } from '@/core/constants/profile-data';
import { ChevronDown, ChevronUp } from 'lucide-react';


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

// Helper de dades
const findItemData = (id: string, dataset: typeof FOOD_DATA): UIItem => {
  for (const category of dataset) {
    const item = category.items.find((i) => i.id === id);
    if (item) return { id: item.id, emoji: item.emoji, label: item.id };
  }
  return { id, emoji: '❓', label: id };
};

export function UserPreferencesSidebar({ foodPreferences, exclusions, className }: Props) {
  
  // 1. Preparem dades
  const preferencesList = useMemo(() => {
    const safe = Array.isArray(foodPreferences) ? foodPreferences : [];
    return safe.map(id => findItemData(id, FOOD_DATA));
  }, [foodPreferences]);

  const exclusionsList = useMemo(() => {
    const safe = Array.isArray(exclusions) ? exclusions : [];
    return safe.map(id => findItemData(id, EXCLUSION_DATA));
  }, [exclusions]);

  return (
    <aside className={`
      flex flex-col items-center py-3 w-full h-full overflow-hidden relative
      ${className}
    `}>
      
      {/* 1. HEADER FIX (PERFIL) */}
      <div className="shrink-0 mb-2 z-20">
        <Link 
           href="/profile"
           className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center border-b-[3px] border-indigo-900 active:border-b-0 active:translate-y-0.75 transition-all group shadow-lg shadow-indigo-900/20"
           title="Editar Perfil"
        >
           <span className="text-xl group-hover:rotate-12 transition-transform filter drop-shadow-md">😎</span>
        </Link>
      </div>

      {/* 2. ZONA GUSTOS (Ocupa 2/3 -> flex-[2]) */}
      <div className="w-full flex-2 min-h-0 border-b border-zinc-800/50 flex flex-col relative">
        <ScrollableSection 
            title="GUSTOS" 
            items={preferencesList} 
            color="green" 
        />
      </div>

      {/* 3. ZONA ALÈRGIES (Ocupa 1/3 -> flex-[1]) */}
      <div className="w-full flex-1 min-h-0 flex flex-col relative pt-2">
        <ScrollableSection 
            title="ALERTA" 
            items={exclusionsList} 
            color="red" 
        />
      </div>

    </aside>
  );
}

// ----------------------------------------------------------------------
// COMPONENT: SECCIÓ AMB SCROLL MANUAL (Fletxes)
// ----------------------------------------------------------------------

interface SectionProps {
    title: string;
    items: UIItem[];
    color: 'green' | 'red';
}

function ScrollableSection({ title, items, color }: SectionProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);

    // Funció per comprovar si calen fletxes
    const checkScroll = () => {
        if (listRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            setCanScrollUp(scrollTop > 0);
            // Donem 1px de marge per errors de arrodoniment
            setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
        }
    };

    // Observer per detectar canvis de mida o d'items
    useEffect(() => {
        checkScroll();
        const element = listRef.current;
        if (!element) return;
        
        element.addEventListener('scroll', checkScroll);
        // També observem si canvia la mida de la finestra
        const resizeObserver = new ResizeObserver(checkScroll);
        resizeObserver.observe(element);

        return () => {
            element.removeEventListener('scroll', checkScroll);
            resizeObserver.disconnect();
        };
    }, [items]);

    // Acció de moure l'scroll
    const scroll = (direction: 'up' | 'down') => {
        if (listRef.current) {
            const scrollAmount = 120; // Píxels a moure (aprox 3 items)
            listRef.current.scrollBy({
                top: direction === 'up' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const labelColor = color === 'green' ? 'text-green-500' : 'text-red-500';

    if (items.length === 0) return null;

    return (
        <div className="flex flex-col h-full w-full items-center">
            {/* Títol fix */}
            <div className={`text-[9px] font-black ${labelColor} uppercase tracking-widest py-1 opacity-80 shrink-0`}>
                {title}
            </div>

            {/* Fletxa PUJAR (Només si cal) */}
            <div className="h-6 shrink-0 flex items-center justify-center w-full">
                {canScrollUp && (
                    <button 
                        onClick={() => scroll('up')}
                        className="text-zinc-600 hover:text-white transition-colors animate-in fade-in slide-in-from-bottom-2 duration-200"
                    >
                        <ChevronUp size={16} />
                    </button>
                )}
            </div>

            {/* Llista Scrollable (Scrollbar amagat) */}
            <div 
                ref={listRef}
                className="flex-1 w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col items-center gap-2 py-1"
            >
                {items.map((item) => (
                    <ItemBubble key={item.id} {...item} variant={color} />
                ))}
                
                {/* Indicador final (opcional, per omplir espai) */}
                <div className="h-4 w-full shrink-0"></div> 
            </div>

            {/* Fletxa BAIXAR (Només si cal) */}
            <div className="h-6 shrink-0 flex items-center justify-center w-full">
                {canScrollDown && (
                    <button 
                        onClick={() => scroll('down')}
                        className="text-zinc-600 hover:text-white transition-colors animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        <ChevronDown size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// SUBCOMPONENTS VISUALS (Tooltips & Bubbles)
// ----------------------------------------------------------------------

function ItemBubble({ emoji, label, variant }: { emoji: string; label: string; variant: 'green' | 'red' }) {
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({ 
            top: rect.top + (rect.height / 2), 
            left: rect.right + 12
        });
        setIsHovered(true);
    }
  };

  const styles = {
    green: 'bg-green-900/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-400',
    red: 'bg-red-900/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400',
  };

  return (
    <>
        <div 
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                w-12 h-12 shrink-0 rounded-lg border flex items-center justify-center text-lg cursor-help transition-all duration-200
                ${styles[variant]}
                ${isHovered ? 'scale-110 shadow-lg ring-1 ring-white/20' : ''}
            `}
        >
            {emoji}
        </div>

        {isHovered && (
            <PortalTooltip top={coords.top} left={coords.left} label={label} />
        )}
    </>
  );
}

function PortalTooltip({ top, left, label }: { top: number, left: number, label: string }) {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div 
            className="fixed z-9999 pointer-events-none flex items-center animate-in fade-in zoom-in-95 duration-150"
            style={{ 
                top: top, 
                left: left,
                transform: 'translateY(-50%)' 
            }}
        >
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-zinc-900 border-b-[6px] border-b-transparent -mr-px"></div>
            <div className="bg-zinc-900 border border-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap">
                {label}
            </div>
        </div>,
        document.body
    );
}