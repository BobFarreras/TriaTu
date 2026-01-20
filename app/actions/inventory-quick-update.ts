// ARXIU: src/app/actions/inventory-quick-update.ts
'use server';

import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { StorageLocation } from '@/core/domain/entities/StorageLocation'; // ✅ Necessari per recrear
import { FOOD_PRESETS } from '@/lib/food-presets'; // ✅ Necessari per calcular data/emoji
import { error as logError } from '@/lib/logger';

// --- HELPER: Conversió d'Unitats ---
function normalizeQuantity(qty: number, unit: string): { val: number; base: string } {
  const u = unit.toLowerCase().trim();
  if (u === 'kg' || u === 'kilogram') return { val: qty * 1000, base: 'g' };
  if (u === 'g' || u === 'gram' || u === 'gr') return { val: qty, base: 'g' };
  if (u === 'l' || u === 'litre' || u === 'litres') return { val: qty * 1000, base: 'ml' };
  if (u === 'ml' || u === 'cl') return { val: qty, base: 'ml' };
  return { val: qty, base: 'ut' };
}

// --- HELPER: Calcular Data i Emoji (Duplicat per seguretat o moure a @/lib/utils) ---
function getSmartDetails(name: string) {
    const preset = FOOD_PRESETS.find(p => p.name.toLowerCase() === name.toLowerCase());
    const emoji = preset?.emoji || '📦';
    let expiryDate: Date | undefined = undefined;
    
    if (preset) {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + preset.expirationDays);
    }
    return { emoji, expiryDate };
}

export async function toggleIngredientStockAction(
  userId: string,
  ingredientName: string,
  quantityRequired: number,
  action: 'CONSUME' | 'RESTORE',
  unitRequired: string = 'ut'
) {
  try {
    const supabase = await createClient();
    const inventoryRepo = container.getInventoryRepo(supabase);

    // 1. Busquem l'ítem (Case insensitive)
    const allItems = await inventoryRepo.findByContext(userId);
    const item = allItems.find(i => 
        i.name.toLowerCase() === ingredientName.toLowerCase() || // Prioritzem match exacte
        i.name.toLowerCase().includes(ingredientName.toLowerCase()) || 
        ingredientName.toLowerCase().includes(i.name.toLowerCase())
    );

    // ❌ CAS: L'ITEM NO EXISTEIX
    if (!item) {
        if (action === 'CONSUME') {
            return { success: false, error: `No tens ${ingredientName} a l'inventari.` };
        }
        
        // ✅ SOLUCIÓ MÀGICA: SI ÉS RESTORE, EL RE-CREEM!
        if (action === 'RESTORE') {
            const { emoji, expiryDate } = getSmartDetails(ingredientName);
            const addItemUseCase = container.getAddItem(supabase);

            await addItemUseCase.execute({
                userId,
                name: ingredientName,
                quantity: quantityRequired, // Restaurem exactament el que demana la recepta
                unit: unitRequired,         // Amb la unitat de la recepta
                location: StorageLocation.PANTRY, // Per defecte
                emoji: emoji,
                expiryDate: expiryDate,
                addedAt: new Date()
            });

            revalidatePath('/inventory');
            revalidatePath(`/recipes`);
            return { success: true, newQuantity: quantityRequired, unit: unitRequired, status: 'RESTORED_CREATED' };
        }
    }

    // --- Si l'item existeix, continuem amb la lògica normal ---

    // 2. LÒGICA DE CONVERSIÓ I CÀLCUL
    // Nota: Si acabem de crear l'item a dalt, ja hem retornat, així que aquí 'item' és segur.
    const current = normalizeQuantity(item!.quantity, item!.unit);
    const required = normalizeQuantity(quantityRequired, unitRequired);

    let newBaseQuantity = 0;

    if (action === 'CONSUME') {
        if (current.base !== required.base && current.base !== 'ut') {
             console.warn(`Unitats incompatibles: ${item!.unit} vs ${unitRequired}`);
        }
        newBaseQuantity = current.val - required.val;
    } else {
        // RESTORE (Sumem)
        newBaseQuantity = current.val + required.val;
    }

    // 3. RECONVERSIÓ A LA UNITAT DE L'USUARI
    let finalQuantity = newBaseQuantity;
    if (item!.unit.toLowerCase() === 'kg' && current.base === 'g') finalQuantity = newBaseQuantity / 1000;
    if (item!.unit.toLowerCase() === 'l' && current.base === 'ml') finalQuantity = newBaseQuantity / 1000;
    
    finalQuantity = Number(finalQuantity.toFixed(3));

    // 4. EXECUTAR ACTUALITZACIÓ
    if (finalQuantity <= 0) {
        // DELETE
        const deleteUseCase = container.getDeleteItem(supabase);
        await deleteUseCase.execute(item!.id);
        
        revalidatePath('/inventory');
        revalidatePath(`/recipes`);
        return { success: true, newQuantity: 0, unit: item!.unit, status: 'DELETED' };
    } else {
        // UPDATE
        const updateUseCase = container.getUpdateItem(supabase);
        await updateUseCase.execute({
            ...item!.props,
            quantity: finalQuantity,
        });

        revalidatePath('/inventory');
        revalidatePath(`/recipes`);
        return { success: true, newQuantity: finalQuantity, unit: item!.unit, status: 'UPDATED' };
    }

  } catch (error) {
    logError("Error en toggleIngredient:", error);
    return { success: false, error: "Error actualitzant l'estoc." };
  }
}
