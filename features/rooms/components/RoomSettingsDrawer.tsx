'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X, Share2, ChevronRight } from 'lucide-react';
import { deleteRoom } from '@/features/rooms/actions/delete-room';
import { DrawerTranslations } from './drawer/types';
import { FeaturesSection } from './drawer/FeaturesSection';
import { DeleteSection } from './drawer/DeleteSection';

// Tipus d'entrada flexible per compatibilitat amb i18n
export interface RoomDrawerTranslationsInput {
  room: {
    [key: string]: unknown;
  };
}

interface RoomSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
  isHost: boolean;
  features: { inventory: boolean; shoppingList: boolean };
  onToggleFeature: (setting: 'enableInventory' | 'enableShoppingList', value: boolean) => void;
  onCopyCode: () => void;
  t: RoomDrawerTranslationsInput;
}

export function RoomSettingsDrawer({ 
  isOpen, onClose, roomId, roomName, isHost, features, onToggleFeature, onCopyCode, t 
}: RoomSettingsDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  // Mapeig segur de textos
  const txt: DrawerTranslations = {
    settings: (t.room.settings as string) || 'Ajustos',
    features_title: (t.room.features_title as string) || 'Funcionalitats',
    enable_inventory: (t.room.enable_inventory as string) || 'Inventari',
    enable_shopping: (t.room.enable_shopping as string) || 'Llista Compra',
    actions_title: (t.room.actions_title as string) || 'Accions',
    invite_cta: (t.room.invite_cta as string) || 'Invitar',
    delete_room: (t.room.delete_room as string) || 'Eliminar Sala',
    deleting: (t.room.deleting as string) || 'Eliminant...',
    delete_confirm_msg: (t.room.delete_confirm_msg as string) || 'Segur?',
  };

  const handleDelete = () => {
    if (!confirm(txt.delete_confirm_msg.replace('{name}', roomName))) return;
    
    startTransition(async () => {
      try {
        const result = await deleteRoom(roomId);
        if (result && result.success) {
            router.push('/rooms'); 
            router.refresh(); 
        } else {
            alert((result && result.error) || 'Error al eliminar');
        }
      } catch (error) {
        console.error(error);
        alert('Error de connexió');
      }
    });
  };

  return (
    <>
      {/* BACKDROP */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-500"
        onClick={isPending ? undefined : onClose} 
      />
      
      {/* DRAWER / MODAL CONTAINER */}
      <div
        id="tour-room-settings"
        className={`
        fixed z-50 bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden
        
        /* ✨ ANIMACIÓ DE FLUX (Fluid Physics) ✨ */
        /* + cubic-bezier fa que sembli app nativa */
        animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        
        /* --- MOBILE STYLES (Sheet inferior) --- */
        bottom-0 left-0 right-0 
        rounded-t-[2.5rem] 
        
        /* --- DESKTOP STYLES (Modal Centrada) --- */
        /* Nota: A escriptori canviem l'animació a zoom i fade */
        md:bottom-auto md:top-1/2 md:left-1/2 
        md:-translate-x-1/2 md:-translate-y-1/2
        md:w-125 md:h-auto md:max-h-[85vh]
        md:rounded-[2.5rem] 
        md:zoom-in-95 md:slide-in-from-bottom-0 /* Resetegem slide en desktop */
      `}
      >
        
        {/* Mobile Handle (Indicador visual) */}
        <div className="w-full flex justify-center pt-4 md:hidden" onClick={onClose}>
             <div className="w-16 h-1.5 bg-zinc-800 rounded-full opacity-50" />
        </div>

        <div className="p-6 pb-10 pt-4 md:pt-8 overflow-y-auto max-h-[80vh]">
            
            {/* Header amb Botó Tancar */}
            <div className="flex justify-between items-center mb-8 pl-1">
                <h2 className="text-xl font-bold text-white">{txt.settings}</h2>
                <button 
                    onClick={onClose} 
                    disabled={isPending}
                    type="button"
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors disabled:opacity-50"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-8">
                {/* Features (Només Host) */}
                {isHost && (
                    <FeaturesSection 
                        txt={txt} 
                        features={features} 
                        onToggle={onToggleFeature} 
                        isPending={isPending} 
                    />
                )}

                {/* Accions */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">{txt.actions_title}</p>
                    <button 
                        onClick={onCopyCode}
                        disabled={isPending}
                        type="button"
                        className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl active:scale-[0.98] transition-all group disabled:opacity-50 hover:bg-zinc-900/80"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Share2 size={20} />
                            </div>
                            <span className="font-semibold text-zinc-200">{txt.invite_cta}</span>
                        </div>
                        <ChevronRight size={18} className="text-zinc-600" />
                    </button>
                </div>

                {/* Eliminar (Només Host) */}
                {isHost && (
                    <DeleteSection 
                        txt={txt} 
                        onDelete={handleDelete} 
                        isPending={isPending} 
                    />
                )}
            </div>
        </div>
      </div>
    </>
  );
}
