// src/components/ui/StackedEmoji.tsx
import { useMemo } from 'react';

interface Props {
  emoji: string;
  size?: 'sm' | 'md'; // sm = Mòbil, md = Escriptori
  className?: string;
}

export function StackedEmoji({ emoji, size = 'md', className = '' }: Props) {
  
  // ✅ SOLUCIÓ ERROR TS: Usem Array.from() en lloc de [...emoji]
  // Això funciona en totes les versions de JS/TS sense tocar config.
  const chars = useMemo(() => Array.from(emoji || '❓'), [emoji]);
  const isMulti = chars.length > 1;

  // Configuració de mides segons el lloc on es fa servir
  const config = {
    sm: { // Mòbil
      single: 'text-lg',
      multi: 'text-[12px]',
      offset: { x: 1, y: 0.5 } // Píxels de desplaçament
    },
    md: { // Escriptori
      single: 'text-xl',
      multi: 'text-sm',
      offset: { x: 2.5, y: 3 }
    }
  };

  const current = config[size];

  // CAS 1: Emoji simple
  if (!isMulti) {
    return (
      <span className={`${current.single} ${className}`}>
        {emoji}
      </span>
    );
  }

  // CAS 2: Emojis múltiples (Stacked)
  return (
    <div className={`relative w-full h-full flex items-center justify-center pointer-events-none ${className}`}>
      {chars.map((char, i) => (
        <span 
          key={i} 
          className={`
            absolute transition-transform leading-none
            ${current.multi}
            ${i === 0 
                // El primer (fons)
                ? 'opacity-80 scale-110' 
                // El segon (davant)
                : 'z-10'
            }
          `}
          style={{
             // Apliquem transformacions dinàmiques segons la mida
             transform: i === 0 
                ? `translate(-${current.offset.x}px, -${current.offset.y}px)` 
                : `translate(${current.offset.x}px, ${current.offset.y}px)`
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}