import { Button } from '@/components/ui/Button';
import { EnergyTimeSliders } from '../components/EnergyTimeSliders';

interface Props {
  onSuggest: () => void;
  isPending: boolean;
  energy: number;
  time: number;
  setEnergy: (v: number) => void;
  setTime: (v: number) => void;
}

export function ChefView({ onSuggest, isPending, energy, time, setEnergy, setTime }: Props) {
  return (
    <div className="w-full flex flex-col gap-2 animate-in fade-in duration-300">
      
      {/* Controls Integrats */}
      <EnergyTimeSliders
        energy={energy}
        time={time}
        onEnergyChange={setEnergy}
        onTimeChange={setTime}
      />

      {/* Botó */}
      <Button
        onClick={onSuggest}
        isLoading={isPending}
        className="w-full py-3 rounded-xl font-black text-sm shadow-lg bg-purple-600 hover:bg-purple-500 text-white border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all"
      >
        <span className="flex items-center justify-center gap-2">
             <span>🍳</span> GENERAR MENÚ
        </span>
      </Button>
    </div>
  );
}