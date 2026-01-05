'use server';

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';
import {

    ToggleStockSchema
} from '@/core/application/schemas/inputSchemas'; // ✅ Importem Schemas
import { z } from 'zod';


// Helper segur per errors de Zod
function getZodError(error: z.ZodError<unknown>): string {
    return error.issues[0]?.message || "Dades invàlides";
}
// ------------------------------------------------------------------
// 5. TOGGLE INGREDIENT STOCK (L'acció especial)
// ------------------------------------------------------------------
// Aquesta acció solia tenir SQL directe. Ara la netegem i validem.
export async function toggleIngredientStockAction(
    userId: string,
    ingredientName: string,
    quantityRequired: number,
    action: 'CONSUME' | 'RESTORE'
) {
    // 1. Validació
    const validation = ToggleStockSchema.safeParse({ userId, ingredientName, quantityRequired, action });

    if (!validation.success) {
        return { success: false, error: getZodError(validation.error) };
    }

    const { data } = validation; // Dades tipades i netes
    const supabase = await createClient();

    try {
        // 2. Busquem l'item de manera segura (sense logs excessius)
        // Utilitzem .textSearch o .ilike però amb la dada validada
        const { data: items, error: searchError } = await supabase
            .from('inventory_items')
            .select('*')
            .eq('user_id', data.userId)
            .ilike('name', `%${data.ingredientName}%`)
            .limit(1); // Només en necessitem un

        if (searchError) throw new Error("Database error");

        if (!items || items.length === 0) {
            return { success: false, error: `Producte "${data.ingredientName}" no trobat.` };
        }

        const item = items[0];
        const currentQty = Number(item.quantity);
        let newQty = currentQty;

        if (data.action === 'CONSUME') {
            newQty = Math.max(0, currentQty - data.quantityRequired);
        } else {
            newQty = currentQty + data.quantityRequired;
        }

        // 3. Actualitzem
        const { error: updateError } = await supabase
            .from('inventory_items')
            .update({ quantity: newQty })
            .eq('id', item.id);

        if (updateError) throw updateError;

        revalidatePath('/inventory');
        revalidatePath(`/recipes`);

        return { success: true, newQuantity: newQty, unit: item.unit };

    } catch (error) {
        console.error('❌ [ACTION ERROR]', error);
        return { success: false, error: 'Error actualitzant l\'estoc.' };
    }
}