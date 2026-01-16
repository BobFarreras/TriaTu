// ARXIU: src/components/shopping/ShoppingListManager.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

// Accions
import { toggleShoppingItemAction, completeShoppingSessionAction} from '@/app/actions/shopping-list-actions';

// Contextos
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';

// Components
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { ShoppingItemUI, ShoppingListItem } from './ShoppingListItem'; // Assegura't de tenir aquest import correcte
import { ShoppingHistory, HistorySession } from './ShoppingHistory';
import { BulkAddShoppingItemForm } from './BulkAddShoppingItemForm';
import { ShoppingHeader } from './ShoppingHeader';
import { ShoppingStats } from './ShoppingStats';


interface Props {
    initialItems: ShoppingItemUI[];
    history: HistorySession[];
}

export function ShoppingListManager({ initialItems, history }: Props) {
    const router = useRouter();
    const { t } = useLanguage();
    const { startTour } = useOnboarding();

    // --- ESTAT ---
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [items, setItems] = useState<ShoppingItemUI[]>(initialItems);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);

    // Sincronització
    useEffect(() => { setItems(initialItems); }, [initialItems]);

    // --- CÀLCULS ---
    const cartTotal = items.filter(i => i.isChecked).reduce((acc, i) => acc + (i.estimatedCost || 0) * i.quantity, 0);
    const pendingTotal = items.filter(i => !i.isChecked).reduce((acc, i) => acc + (i.estimatedCost || 0) * i.quantity, 0);
    const grandTotal = cartTotal + pendingTotal;
    const checkedCount = items.filter(i => i.isChecked).length;

    // --- TOUR ---
    const onboardingSteps: TourStep[] = useMemo(() => [
        {
            targetId: 'tour-shopping-header',
            title: t.onboarding?.shopping?.step_welcome_title || "Benvingut", // Fallback segur
            description: t.onboarding?.shopping?.step_welcome_desc || "Descripció...",
        },
        {
            targetId: 'tour-shopping-tabs',
            title: t.onboarding?.shopping?.step_tabs_title,
            description: t.onboarding?.shopping?.step_tabs_desc,
        },
        {
            targetId: 'tour-shopping-stats',
            title: t.onboarding?.shopping?.step_stats_title,
            description: t.onboarding?.shopping?.step_stats_desc,
        },
        {
            targetId: 'tour-shopping-add-btn',
            title: t.onboarding?.shopping?.step_add_title,
            description: t.onboarding?.shopping?.step_add_desc,
        },
        {
            targetId: 'tour-shopping-finish-btn',
            title: t.onboarding?.shopping?.step_finish_title,
            description: t.onboarding?.shopping?.step_finish_desc,
        }
    ], [t]);

    // Filtrar passos actius
    const activeSteps = useMemo(() => {
        return onboardingSteps.filter(step => {
            if (step.targetId === 'tour-shopping-finish-btn' && checkedCount === 0) return false;
            return true;
        });
    }, [onboardingSteps, checkedCount]);

    // Auto-start del tour
    useEffect(() => {
        const timer = setTimeout(() => {
            startTour('shopping-list-v1', activeSteps);
        }, 1000);
        return () => clearTimeout(timer);
    }, [startTour, activeSteps]);

    // --- HANDLERS ---
    const handleToggle = async (id: string, currentStatus: boolean) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, isChecked: !currentStatus } : i));
        await toggleShoppingItemAction(id, !currentStatus);
    };

    const handleFinish = async () => {
        if (checkedCount === 0) return;
        setIsCompleting(true);
        const result = await completeShoppingSessionAction();
        if (result.success) {
            toast.success(`🎉 Compra finalitzada!`, { description: `Cost total: ${cartTotal.toFixed(2)}€` });
        } else {
            toast.error("Error al finalitzar", { description: result.error });
        }
        setIsCompleting(false);
    };

 

    const handleCloseModal = () => {
        setIsAddMode(false);
        router.refresh();
    };

    return (
        <>
            <AnimatePresence>
                {isAddMode && <BulkAddShoppingItemForm onClose={handleCloseModal} />}
            </AnimatePresence>

            <div className="space-y-6 pb-24">
                
                {/* 1. HEADER */}
                <div id="tour-shopping-header" className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <ShoppingHeader 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab} 
                                onSearchClick={() => setIsAddMode(true)}
                                tourId="tour-shopping-tabs"
                            />
                        </div>
                        <TourTrigger 
                            tourId="shopping-list-v1" 
                            steps={activeSteps}
                            className="bg-slate-900 border-slate-800 text-purple-400 hover:bg-slate-800 shrink-0"
                        />
                    </div>
                </div>

                {activeTab === 'active' ? (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* 2. STATS */}
                        <div id="tour-shopping-stats">
                            <ShoppingStats grandTotal={grandTotal} cartTotal={cartTotal} />
                        </div>

         

                        {/* 4. LLISTA ACTIVA */}
                        <div className="space-y-2 pb-32">
                            <AnimatePresence mode='popLayout'>
                                {items.map((item) => (
                                    <ShoppingListItem key={item.id} item={item} onToggle={handleToggle} />
                                ))}
                            </AnimatePresence>

                            {items.length === 0 && (
                                <div className="text-center py-10 text-slate-500 bg-slate-900/20 rounded-xl border border-slate-800/50 border-dashed">
                                    <div className="text-2xl mb-2">🛒</div>
                                    Tot net! Afegeix coses per comprar.
                                </div>
                            )}
                        </div>

                        {/* 5. FOOTER FINALITZAR (INTEGRAT AQUÍ PER SIMPLIFICAR) */}
                        <AnimatePresence>
                            {checkedCount > 0 && (
                                <motion.div
                                    id="tour-shopping-finish-btn"
                                    initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                                    className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40"
                                >
                                    <button
                                        onClick={handleFinish}
                                        disabled={isCompleting}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-2xl shadow-emerald-900/50 flex items-center gap-3 transition-all active:scale-95 border-t border-emerald-400/20"
                                    >
                                        {isCompleting ? <span className="animate-spin">⏳</span> : <span>💳 Finalitzar Compra</span>}
                                        <span className="bg-emerald-800 px-2 py-0.5 rounded-full text-xs font-mono border border-emerald-700">
                                            {cartTotal.toFixed(2)}€
                                        </span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <ShoppingHistory sessions={history} />
                    </motion.div>
                )}
            </div>
        </>
    );
}