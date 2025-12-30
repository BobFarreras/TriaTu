'use server';

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleIngredientStockAction(
    userId: string, 
    ingredientName: string, 
    quantityRequired: number, 
    action: 'CONSUME' | 'RESTORE'
) {
    const supabase = await createClient();

    try {
        // 1. Busquem l'item a l'inventari (Match fuzzy per nom)
        // Nota: Això és una simplificació. L'ideal seria tenir IDs exactes, però la IA genera noms de text.
        const { data: items } = await supabase
            .from('inventory_items')
            .select('*')
            .eq('user_id', userId)
            .ilike('name', `%${ingredientName}%`); // Busquem similitud

        // Si no trobem res semblant, no podem restar
        if (!items || items.length === 0) {
            return { success: false, error: 'Producte no trobat al rebost.' };
        }

        // Agafem el millor candidat (el primer)
        const item = items[0];
        const currentQty = Number(item.quantity);
        
        let newQty = currentQty;

        if (action === 'CONSUME') {
            newQty = Math.max(0, currentQty - quantityRequired);
        } else {
            newQty = currentQty + quantityRequired;
        }

        // 2. Actualitzem
        const { error } = await supabase
            .from('inventory_items')
            .update({ quantity: newQty })
            .eq('id', item.id);

        if (error) throw error;

        revalidatePath('/inventory');
        revalidatePath(`/recipes`); 

        return { success: true, newQuantity: newQty, unit: item.unit };

    } catch (error) {
        console.error('Error updating stock:', error);
        return { success: false, error: 'Error de connexió.' };
    }
}