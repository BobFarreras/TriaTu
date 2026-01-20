// src/features/decision/components/views/FateView.tsx
'use client'; 

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  onDecide: () => void;
  isPending: boolean;
}

export function FateView({ onDecide, isPending }: Props) {
  const { t } = useLanguage();

  return (
    <div className="w-full animate-in fade-in duration-300 pt-2">
      {/* ✅ ID pel Botó (Mateix ID que al ChefView per simplificar el tour) */}
      <div id="tour-dec-action">
          <Button
            onClick={onDecide}
            isLoading={isPending}
            className="w-full py-4 rounded-xl font-black text-base shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
                <span>🎲</span> {t.decision.actions.surprise_me}
            </span>
          </Button>
      </div>
    </div>
  );
}
