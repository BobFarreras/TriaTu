// src/features/profile/ui/components/ToleranceCard.tsx
// ✅ Importem el tipus
import { ca } from '@/lib/i18n/locales/ca';
type Dictionary = typeof ca;

interface Props {
    tolerance: number;
    setTolerance: (v: number) => void;
    t: Dictionary; // ✅ Tipat fort
}
export function ToleranceCard({ tolerance, setTolerance, t }: Props) {
    return (
        <div id="tour-profile-tolerance" className="bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] border-4 border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-blue-900/50 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-400 to-cyan-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

            <div className="flex flex-col items-center text-center">
                <span className="text-5xl mb-4 transition-transform hover:scale-125 cursor-help select-none">
                    {tolerance <= 3 ? '😤' : tolerance >= 8 ? '😇' : '😐'}
                </span>
                <h2 className="text-xl font-black text-white mb-1">
                    {t.profile?.flexibility_title || 'Nivell de Flexibilitat'}
                </h2>
                <p className="text-blue-400 font-black text-3xl mb-6">{tolerance}/10</p>

                <div className="w-full max-w-sm relative h-12 flex items-center">
                    <div className="absolute w-full h-4 bg-black rounded-full overflow-hidden border border-zinc-700">
                        <div className="h-full bg-linear-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300" style={{ width: `${tolerance * 10}%` }} />
                    </div>
                    <input
                        type="range" name="socialTolerance" min="1" max="10" value={tolerance}
                        onChange={(e) => setTolerance(Number(e.target.value))}
                        className="absolute w-full h-12 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute h-8 w-8 bg-zinc-900 border-4 border-white rounded-full shadow-lg pointer-events-none transition-all duration-200" style={{ left: `calc(${tolerance * 10}% - 16px)` }}></div>
                </div>

                <div className="flex justify-between w-full max-w-sm text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">
                    <span>{t.profile?.rigid || 'RÍGID'}</span>
                    <span>{t.profile?.flexible || 'FLEXIBLE'}</span>
                </div>
            </div>
        </div>
    );
}