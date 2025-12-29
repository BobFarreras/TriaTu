// src/components/inventory/ConsumeButton.tsx
'use client';

import { useState } from 'react';
import { consumeItemAction } from '@/app/actions/inventory';

export function ConsumeButton({ itemId, currentQty }: { itemId: string, currentQty: number }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConsume = async () => {
    // Aquí podries obrir un Modal bonic en lloc del confirm natiu en futures iteracions
    if (!confirm(`😋 T'has menjat una unitat?`)) return;
    
    setIsLoading(true);
    await consumeItemAction(itemId, 1);
    setIsLoading(false);
  };

  return (
    <button 
      onClick={handleConsume}
      disabled={isLoading}
      className="text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {isLoading ? '⏳' : '🍽️ Consumir (-1)'}
    </button>
  );
}