// ARXIU: src/components/shopping/ShoppingListManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { toggleShoppingItemAction, completeShoppingSessionAction} from '@/app/actions/shopping-list-actions';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Subcomponents
import { ShoppingItemUI } from './ShoppingListItem';
import { HistorySession, ShoppingHistory } from './ShoppingHistory';
import { BulkAddShoppingItemForm } from './BulkAddShoppingItemForm';
import { ShoppingHeader } from './ShoppingHeader';
import { ShoppingStats } from './ShoppingStats';
import { ShoppingActiveList } from './ShoppingActiveList';

interface Props {
    initialItems: ShoppingItemUI[];
    history: HistorySession[];
}

export function ShoppingListManager({ initialItems, history }: Props) {
    const router = useRouter();
    
    // State Management
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [items, setItems] = useState<ShoppingItemUI[]>(initialItems);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);

    // Sync state on revalidate
    useEffect(() => { setItems(initialItems); }, [initialItems]);

    // Computed Values
    const cartTotal = items.filter(i => i.isChecked).reduce((acc, i) => acc + (i.estimatedCost || 0) * i.quantity, 0);
    const pendingTotal = items.filter(i => !i.isChecked).reduce((acc, i) => acc + (i.estimatedCost || 0) * i.quantity, 0);
    const grandTotal = cartTotal + pendingTotal;

    // Handlers
    const handleToggle = async (id: string, currentStatus: boolean) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, isChecked: !currentStatus } : i));
        await toggleShoppingItemAction(id, !currentStatus);
    };

    const handleFinish = async () => {
        const hasChecked = items.some(i => i.isChecked);
        if (!hasChecked) return;
        
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
            {/* Modal de Cerca (Overlay) */}
            <AnimatePresence>
                {isAddMode && <BulkAddShoppingItemForm onClose={handleCloseModal} />}
            </AnimatePresence>

            <div className="space-y-6">
                
                {/* 1. Header (Tabs + Botó Cerca) */}
                <ShoppingHeader 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                    onSearchClick={() => setIsAddMode(true)} 
                />

                {/* 2. Contingut Principal */}
                {activeTab === 'active' ? (
                    <>
                        <ShoppingStats grandTotal={grandTotal} cartTotal={cartTotal} />
                        
                        <ShoppingActiveList 
                            items={items}
                            onToggle={handleToggle}
                          
                            onFinish={handleFinish}
                            isCompleting={isCompleting}
                            cartTotal={cartTotal}
                        />
                    </>
                ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <ShoppingHistory sessions={history} />
                    </motion.div>
                )}
            </div>
        </>
    );
}