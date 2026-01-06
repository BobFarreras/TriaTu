// src/features/profile/ui/components/IdentityCard.tsx
import { Edit3 } from 'lucide-react';
// ✅ TRUC MESTRE: Importem l'objecte de traduccions per robar-li el tipus
// Assegura't que la ruta apunta al teu fitxer 'ca.ts' o 'ca/index.ts'
import { ca } from '@/lib/i18n/locales/ca';

// Definim el tipus basat en l'estructura real del fitxer
type Dictionary = typeof ca;
const AVATAR_PRESETS = ['👨‍🍳', '👩‍🍳', '🦁', '👽', '🦄', '🤖', '🐸', '🦊', '🐯', '🐼', '🐙', '👻', '🧙‍♂️', '🥷'];

interface Props {
    username: string;
    setUsername: (v: string) => void;
    avatar: string;
    setAvatar: (v: string) => void;
    t: Dictionary; // ✅ Ara 't' té l'estructura exacta, ja no és 'any'
}

export function IdentityCard({ username, setUsername, avatar, setAvatar, t }: Props) {
    return (
        <div id="tour-profile-identity" className="bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] border-4 border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-400 to-purple-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="relative group/avatar cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center text-5xl shadow-xl transition-transform group-hover/avatar:scale-105 group-hover/avatar:border-indigo-500">
                            {avatar}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full text-white border-4 border-zinc-900">
                            <Edit3 size={14} />
                        </div>
                        <input type="hidden" name="avatar_emoji" value={avatar} />
                    </div>

                    <div className="flex gap-2 max-w-60 overflow-x-auto pb-2 px-1 [scrollbar-width:none]">
                        {AVATAR_PRESETS.map((emoji) => (
                            <button
                                key={emoji} type="button" onClick={() => setAvatar(emoji)}
                                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all border-2 
                                ${avatar === emoji ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-lg' : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">
                        {t.profile?.chef_name || 'Nom de Xef'}
                    </label>
                    <div className="relative">
                        <input
                            type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}
                            placeholder={t.profile?.chef_placeholder || "Ex: Chef Ramsay"} maxLength={20}
                            className="w-full bg-zinc-950/50 border-2 border-zinc-700 rounded-2xl px-5 py-4 text-white font-bold text-lg focus:border-indigo-500 focus:outline-none transition-all placeholder:text-zinc-600"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-600 pointer-events-none">
                            {username.length}/20
                        </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 pl-2">
                        {t.profile?.chef_hint || 'Aquest és el nom que veuran els altres al Rànquing.'}
                    </p>
                </div>
            </div>
        </div>
    );
}