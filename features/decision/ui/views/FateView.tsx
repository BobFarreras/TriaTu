'use client'; // ✅ Necessari per al context

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // ✅ Importem el hook

interface Props {
  onDecide: () => void;
  isPending: boolean;
}

export function FateView({ onDecide, isPending }: Props) {
  const { t } = useLanguage(); // ✅ Obtenim traduccions

  return (
    <div className="w-full animate-in fade-in duration-300 pt-2">
      <Button
        onClick={onDecide}
        isLoading={isPending}
        className="w-full py-4 rounded-xl font-black text-base shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all"
      >
        <span className="flex items-center justify-center gap-2">
            <span>🎲</span> {t.decision.actions.surprise_me} {/* ✅ Text traduït */}
        </span>
      </Button>
    </div>
  );
}