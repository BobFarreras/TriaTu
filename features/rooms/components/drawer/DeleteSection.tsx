// features/rooms/components/drawer/DeleteSection.tsx
import { Loader2, Trash2 } from 'lucide-react';
import { DrawerTranslations } from './types';

interface Props {
  txt: DrawerTranslations;
  onDelete: () => void;
  isPending: boolean;
}

export function DeleteSection({ txt, onDelete, isPending }: Props) {
  return (
    <div className="pt-4 mt-4 border-t border-zinc-900">
      <button 
        onClick={onDelete} 
        disabled={isPending} 
        type="button"
        className={`
          w-full flex items-center justify-center gap-2 p-4 rounded-2xl transition-all font-medium border
          ${isPending 
            ? 'bg-red-500/10 border-red-500/20 text-red-400 cursor-wait' 
            : 'bg-transparent border-transparent text-red-400/80 hover:bg-red-500/10 hover:text-red-400 active:scale-95'
          }
        `}
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>{txt.deleting}</span>
          </>
        ) : (
          <>
            <Trash2 size={18} />
            <span>{txt.delete_room}</span>
          </>
        )}
      </button>
    </div>
  );
}