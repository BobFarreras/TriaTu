// src/features/profile/ui/ProfileForm.tsx
'use client'

import { useActionState, useState, useMemo } from 'react';
import { updateProfileAction } from '@/app/actions/profile-actions';
import { TagInput } from '@/components/ui/TagInput';
import { SearchableSectionGrid } from '@/components/ui/SearchableSectionGrid';
import { EXCLUSION_DATA, FOOD_DATA } from '@/core/constants/profile-data';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Save, CheckCircle2 } from 'lucide-react';

// COMPONENTS FILLS
import { IdentityCard } from './components/IdentityCard';
import { ToleranceCard } from './components/ToleranceCard';

type ProfileData = {
    username?: string;
    avatarEmoji?: string;
    foodPreferences: string[];
    exclusions: string[];
    socialTolerance: number;
};

const getAllIds = (categories: typeof EXCLUSION_DATA) => categories.flatMap(c => c.items.map(i => i.id));

export function ProfileForm({ initialData }: { initialData: ProfileData }) {
    const { t } = useLanguage();
    const [state, action, isPending] = useActionState(updateProfileAction, {});

    // Estats
    const [username, setUsername] = useState(initialData.username || '');
    const [avatar, setAvatar] = useState(initialData.avatarEmoji || '👨‍🍳');
    const [selectedFood, setSelectedFood] = useState<string[]>(initialData.foodPreferences.filter(f => getAllIds(FOOD_DATA).includes(f)));
    const [selectedExclusions, setSelectedExclusions] = useState<string[]>(initialData.exclusions.filter(ex => getAllIds(EXCLUSION_DATA).includes(ex)));
    const [tolerance, setTolerance] = useState(initialData.socialTolerance);

    // Memos de traducció
    const translatedFoodData = useMemo(() => {
        const dict = (t.profile?.food || {}) as Record<string, string>;
        return FOOD_DATA.map(cat => ({
            title: dict[cat.id] || cat.id,
            items: cat.items.map(item => ({ id: item.id, emoji: item.emoji, label: dict[item.id] || item.id }))
        }));
    }, [t]);

    const translatedExclusionData = useMemo(() => {
        const dict = (t.profile?.exclusions || {}) as Record<string, string>;
        return EXCLUSION_DATA.map(cat => ({
            title: dict[cat.id] || cat.id,
            items: cat.items.map(item => ({ id: item.id, emoji: item.emoji, label: dict[item.id] || item.id }))
        }));
    }, [t]);

    // ✅ FUNCIÓ HELPER PER TRADUIR ERRORS
    const getErrorMessage = (errorKey?: string) => {
        if (!errorKey) return null;

        // Mapeig de codis de servidor a textos de client
        switch (errorKey) {
            case 'ERR_USERNAME_EMPTY':
                return t.errors?.username_empty || "Nom d'usuari obligatori";
            case 'Error updating profile':
                return t.errors?.save_error || "Error al guardar";
            default:
                // Si és un error que no coneixem, el mostrem tal qual o un genèric
                return errorKey;
        }
    };

    const displayError = getErrorMessage(state.error);
    const hasError = !state.success && !!displayError;

    return (
        <form action={action} className="space-y-6">

            {/* 1. IDENTITAT */}
            <IdentityCard
                username={username} setUsername={setUsername}
                avatar={avatar} setAvatar={setAvatar}
                t={t}
            />

            {/* 2. MENJAR (Podríem fer un component FoodCard també si volguessis) */}
            <div id="tour-profile-food" className="bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] border-4 border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-green-900/50 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-green-400 to-emerald-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-900/30 text-green-500 rounded-2xl flex items-center justify-center text-2xl animate-bounce-click">😋</div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-none">{t.profile?.menu_title || 'Menú Preferit'}</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">{t.profile?.menu_desc || 'Què t\'agrada?'}</p>
                    </div>
                </div>
                <SearchableSectionGrid data={translatedFoodData} selectedValues={selectedFood} onChange={setSelectedFood} placeholder={t.profile?.search_food} accentColor="green" />
                <input type="hidden" name="foodPreferences" value={selectedFood.join(',')} />
            </div>

            {/* 3. EXCLUSIONS */}
            <div id="tour-profile-exclusions" className="bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] border-4 border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-red-900/50 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-red-400 to-orange-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center text-2xl animate-pulse">🚫</div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-none">{t.profile?.blacklist_title || 'Exclusions'}</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">{t.profile?.blacklist_desc || 'Prohibit entrar'}</p>
                    </div>
                </div>
                <SearchableSectionGrid data={translatedExclusionData} selectedValues={selectedExclusions} onChange={setSelectedExclusions} placeholder={t.profile?.search_allergy} accentColor="red" />
                <input type="hidden" name="exclusions_base" value={selectedExclusions.join(',')} />

                <div className="mt-8 pt-6 border-t-2 border-dashed border-zinc-800">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-black bg-orange-900/30 text-orange-400 px-2 py-1 rounded-md uppercase tracking-wider">Extra</span>
                        <span className="text-sm font-bold text-gray-500">{t.profile?.warning_title}</span>
                    </div>
                    <TagInput label="" name="exclusions_extra" placeholder={t.profile?.warning_placeholder} defaultValue={initialData.exclusions.filter(ex => !getAllIds(EXCLUSION_DATA).includes(ex))} />
                </div>
            </div>

            {/* 4. TOLERÀNCIA */}
            <ToleranceCard tolerance={tolerance} setTolerance={setTolerance} t={t} />

            {/* BOTÓ GUARDAR (FAB) */}
            {/* ZONA DE FEEDBACK I BOTÓ */}
            <div id="tour-profile-save" className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full px-4">

                {/* 🔴 MISSATGE D'ERROR TRADUÏT */}
                {hasError && (
                    <div className="animate-in slide-in-from-bottom-5 fade-in duration-300 bg-red-900/90 text-red-200 px-6 py-3 rounded-2xl border border-red-500/50 shadow-xl backdrop-blur-md flex items-center gap-3 font-bold text-sm">
                        <span className="text-xl">⚠️</span>
                        {/* Aquí mostrem el missatge traduït */}
                        {displayError}
                    </div>
                )}

                {/* BOTÓ GUARDAR */}
                <button
                    type="submit"
                    disabled={isPending}
                    className={`
                        group flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl transition-all duration-300 border border-white/10 backdrop-blur-md
                        ${state.success
                            ? 'bg-green-600 text-white hover:bg-green-500 scale-105 ring-4 ring-green-900/30'
                            : hasError
                                ? 'bg-zinc-800 text-white border-red-500/50 hover:bg-zinc-700' // Si hi ha error, marquem el botó
                                : 'bg-white text-black hover:scale-105 hover:-translate-y-1'
                        }
                    `}
                >
                    {isPending ? (
                        <span className="animate-spin text-lg">⏳</span>
                    ) : state.success ? (
                        <CheckCircle2 size={20} className="animate-bounce" />
                    ) : (
                        <Save size={20} className={`group-hover:rotate-12 transition-transform ${hasError ? 'text-red-400' : ''}`} />
                    )}

                    <span className="font-black text-sm md:text-base tracking-wide whitespace-nowrap">
                        {state.success ? (t.profile?.saved || 'GUARDAT!') : (t.profile?.save_btn || 'GUARDAR CANVIS')}
                    </span>
                </button>
            </div>

        </form>
    );
}