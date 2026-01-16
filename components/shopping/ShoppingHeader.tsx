// ARXIU: src/components/shopping/ShoppingHeader.tsx
'use client';

interface Props {
    activeTab: 'active' | 'history';
    onTabChange: (tab: 'active' | 'history') => void;
    onSearchClick: () => void;
}

export function ShoppingHeader({ activeTab, onTabChange, onSearchClick }: Props) {
    return (
        <div className="flex items-center gap-2 sticky top-2 z-30">
            {/* TABS (Ocupen tot l'espai possible) */}
            <div className="flex-1 flex p-1 bg-slate-900 rounded-xl border border-slate-800 shadow-xl shadow-black/20">
                <button
                    onClick={() => onTabChange('active')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-slate-800 text-white shadow ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    🛒 Llista
                </button>
                <button
                    onClick={() => onTabChange('history')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-slate-800 text-white shadow ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    📜 Historial
                </button>
            </div>

            {/* BOTÓ CERCA (Compacte al costat) */}
            {activeTab === 'active' && (
                <button
                    onClick={onSearchClick}
                    className="h-[46px] w-[46px] flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all border border-emerald-500/50"
                    aria-label="Buscar productes"
                >
                    <span className="text-xl">🔎</span>
                </button>
            )}
        </div>
    );
}