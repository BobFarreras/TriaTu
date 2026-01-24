// ARXIU: src/features/shoppingList/components/ShoppingHeader.tsx
'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
    activeTab: 'active' | 'history';
    onTabChange: (tab: 'active' | 'history') => void;
    onSearchClick: () => void;
    tourId?: string; // ✅ Prop opcional
    contextSelector?: React.ReactNode;
}

export function ShoppingHeader({ activeTab, onTabChange, onSearchClick, tourId, contextSelector }: Props) {
    const { t } = useLanguage();

    return (
        <div className="flex items-center gap-2 sticky top-2 z-30">
            {/* TABS (Ocupen tot l'espai possible) */}
            <div id={tourId} className="flex-1 flex p-1 bg-slate-900 rounded-xl border border-slate-800 shadow-xl shadow-black/20">
                <button
                    onClick={() => onTabChange('active')}
                    data-testid="shopping-tab-active"
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-slate-800 text-white shadow ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    🛒 {t.shoppingList.tabs_active}
                </button>
                <button
                    onClick={() => onTabChange('history')}
                    data-testid="shopping-tab-history"
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-slate-800 text-white shadow ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    📜 {t.shoppingList.tabs_history}
                </button>
            </div>

            {contextSelector}

            {/* BOTÓ CERCA (Compacte al costat) */}
            {activeTab === 'active' && (
                <button
                    id="tour-shopping-add-btn"
                    onClick={onSearchClick}
                    data-testid="shopping-add-button"
                    className="h-11.5 w-11.5 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all border border-emerald-500/50"
                    aria-label={t.shoppingList.search_label}
                >
                    <span className="text-xl">🔎</span>
                </button>
            )}
        </div>
    );
}
