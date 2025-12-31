'use server';

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleIngredientStockAction(
    userId: string, 
    ingredientName: string, 
    quantityRequired: number, 
    action: 'CONSUME' | 'RESTORE'
) {
    console.log(`\n🕵️‍♂️ [ACTION START] User: ${userId} | Ing: "${ingredientName}" | Qty: ${quantityRequired} | Action: ${action}`);

    const supabase = await createClient();

    try {
        // 1. Busquem l'item (CORRECCIÓ DE TAULA AQUÍ 👇)
        const searchQuery = `%${ingredientName}%`;
        
        const { data: items, error: searchError } = await supabase
            .from('inventory_items') // ✅ ABANS ERA 'inventory'
            .select('*')
            .eq('user_id', userId)
            .ilike('name', searchQuery);

        if (searchError) {
            console.error("❌ [ACTION ERROR] Error cercant a Supabase:", searchError);
            return { success: false, error: 'Error de base de dades.' };
        }

        console.log(`🕵️‍♂️ [ACTION SEARCH] Query: "${searchQuery}" -> Trobats: ${items?.length || 0} items.`);

        if (!items || items.length === 0) {
            console.warn(`⚠️ [ACTION WARN] No s'ha trobat cap producte semblant a "${ingredientName}"`);
            return { success: false, error: `Producte "${ingredientName}" no trobat al rebost.` };
        }

        const item = items[0];
        console.log(`✅ [ACTION MATCH] Item seleccionat: "${item.name}" (ID: ${item.id}) | Stock actual: ${item.quantity}`);

        const currentQty = Number(item.quantity);
        let newQty = currentQty;

        if (action === 'CONSUME') {
            newQty = Math.max(0, currentQty - quantityRequired);
        } else {
            newQty = currentQty + quantityRequired;
        }

        console.log(`🧮 [ACTION CALC] ${currentQty} -> ${newQty} (${action})`);

        // 2. Actualitzem (CORRECCIÓ DE TAULA AQUÍ 👇)
        const { error: updateError } = await supabase
            .from('inventory_items') // ✅ ABANS ERA 'inventory'
            .update({ quantity: newQty })
            .eq('id', item.id);

        if (updateError) {
            console.error("❌ [ACTION UPDATE ERROR]", updateError);
            throw updateError;
        }

        console.log(`💾 [ACTION SAVE] Actualització correcta a DB.`);

        revalidatePath('/inventory');
        revalidatePath(`/recipes`); 

        return { success: true, newQuantity: newQty, unit: item.unit };

    } catch (error) {
        console.error('❌ [ACTION EXCEPTION]', error);
        return { success: false, error: 'Error de connexió.' };
    }
}