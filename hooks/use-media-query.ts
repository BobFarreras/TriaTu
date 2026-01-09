// src/hooks/use-media-query.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // Inicialitzem en false per assegurar coherència amb el servidor (SSR)
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 1. Actualitzem l'estat inicial immediatament
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // 2. Creem el listener per quan canviï la mida
    const listener = () => setMatches(media.matches);
    
    // 3. Ens subscrivim
    media.addEventListener('change', listener);
    
    // 4. Netegem
    return () => media.removeEventListener('change', listener);
    
    // ⚠️ IMPORTANT: L'array de dependències NOMÉS té 'query'.
    // Hem tret 'matches' d'aquí per evitar el bucle infinit i l'error de React.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); 

  return matches;
}