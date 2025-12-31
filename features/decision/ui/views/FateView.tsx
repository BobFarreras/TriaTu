import { Button } from '@/components/ui/Button';

interface Props {
  onDecide: () => void;
  isPending: boolean;
}

export function FateView({ onDecide, isPending }: Props) {
  return (
    <div className="w-full animate-in fade-in duration-300 pt-2">
      <Button
        onClick={onDecide}
        isLoading={isPending}
        className="w-full py-4 rounded-xl font-black text-base shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all"
      >
        <span className="flex items-center justify-center gap-2">
            <span>🎲</span> SORPRÈN-ME!
        </span>
      </Button>
    </div>
  );
}