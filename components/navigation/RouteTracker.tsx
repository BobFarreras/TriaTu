'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function RouteTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const query = typeof window !== 'undefined' ? window.location.search : '';
    const fullPath = query ? `${pathname}${query}` : pathname;
    const prevPath = prevPathRef.current;
    if (pathname === '/recipes') {
      if (prevPath && prevPath !== '/recipes') {
        sessionStorage.setItem('back-origin:/recipes', prevPath);
      }
    } else {
      sessionStorage.setItem('back-origin:/recipes', fullPath);
    }
    prevPathRef.current = fullPath;
  }, [pathname]);

  return null;
}
