// ARXIU: src/app/actions/inventory-quick-update.ts
'use server';

import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';

// --- HELPER: Conversió d'Unitats ---
// Això evita que 1kg - 200g doni negatiu.
function normalizeQuantity(qty: number, unit: string): { val: number; base: string } {
  const u = unit.toLowerCase().trim();
  
  // Massa (Base: grams)
  if (u === 'kg' || u === 'kilogram') return { val: qty * 1000, base: 'g' };
  if (u === 'g' || u === 'gram' || u === 'gr') return { val: qty, base: 'g' };
  
  // Volum (Base: ml)
  if (u === 'l' || u === 'litre' || u === 'litres') return { val: qty * 1000, base: 'ml' };
  if (u === 'ml' || u === 'cl') return { val: qty, base: 'ml' }; // Simplificació cl -> ml
  
  // Unitats (Base: ut)
  return { val: qty, base: 'ut' };
}

// ------------------------------------------------------------------
// ACCIÓ PRINCIPAL
// ------------------------------------------------------------------
export async function toggleIngredientStockAction(
  userId: string,
  ingredientName: string,
  quantityRequired: number,
  action: 'CONSUME' | 'RESTORE',
  unitRequired: string = 'ut' // Afegim la unitat requerida (ve de la recepta)
) {
  try {
    const supabase = await createClient();
    
    // 1. Obtenim el Repositori (via Container)
    const inventoryRepo = container.getInventoryRepo(supabase);

    // 2. Busquem l'ítem a l'inventari (Search by Name)
    // Com que el Repo no té 'findByName', fem servir 'findByUser' i filtrem en memòria
    // (Això és acceptable per llistes d'inventari personals < 1000 items)
    const allItems = await inventoryRepo.findByUser(userId);
    
    const item = allItems.find(i => 
        i.name.toLowerCase().includes(ingredientName.toLowerCase()) || 
        ingredientName.toLowerCase().includes(i.name.toLowerCase())
    );

    if (!item) {
        if (action === 'CONSUME') {
            return { success: false, error: `No tens ${ingredientName} a l'inventari.` };
        }
        // Si és RESTORE i no existeix, potser l'hauríem de crear? 
        // Per simplicitat, només restaurem si existeix o retornem avís.
        return { success: false, error: "L'article no existeix, afegeix-lo manualment." };
    }

    // 3. LÒGICA DE CONVERSIÓ I CÀLCUL
    const current = normalizeQuantity(item.quantity, item.unit);
    const required = normalizeQuantity(quantityRequired, unitRequired);

    let newBaseQuantity = 0;

    if (action === 'CONSUME') {
        // Validem compatibilitat d'unitats (no restar Peres de Litres)
        if (current.base !== required.base && current.base !== 'ut') {
             // Si no coincideixen bases (ex: g vs ml), assumim que no es pot calcular exacte
             // i restem "per unitat" o donem error.
             // Fallback: Si l'usuari té "1 pot" i la recepta demana "200g",
             // aquí és difícil. Per seguretat, restem proporcionalment o donem error.
             console.warn(`Unitats incompatibles: ${item.unit} vs ${unitRequired}`);
        }

        newBaseQuantity = current.val - required.val;
    } else {
        // RESTORE (Cancel·lar l'acció)
        newBaseQuantity = current.val + required.val;
    }

    // 4. PREPARAR ACTUALITZACIÓ
    // Reconvertim a la unitat ORIGINAL de l'usuari
    let finalQuantity = newBaseQuantity;
    if (item.unit.toLowerCase() === 'kg' && current.base === 'g') finalQuantity = newBaseQuantity / 1000;
    if (item.unit.toLowerCase() === 'l' && current.base === 'ml') finalQuantity = newBaseQuantity / 1000;
    
    // Arrodonim per evitar 0.0000004
    finalQuantity = Number(finalQuantity.toFixed(3));

    // 5. EXECUTAR EL USE CASE CORRESPONENT
    if (finalQuantity <= 0) {
        // Si s'acaba, l'esborrem
        const deleteUseCase = container.getDeleteItem(supabase);
        await deleteUseCase.execute(item.id);
        
        revalidatePath('/inventory');
        revalidatePath(`/recipes`);
        return { success: true, newQuantity: 0, unit: item.unit, status: 'DELETED' };
    } else {
        // Si en sobra, actualitzem
        const updateUseCase = container.getUpdateItem(supabase);
        await updateUseCase.execute({
            ...item.props, // Mantenim la resta de dades (emoji, location...)
            quantity: finalQuantity,
            // Important: no canviem la unitat base de l'usuari, només la quantitat
        });

        revalidatePath('/inventory');
        revalidatePath(`/recipes`);
        return { success: true, newQuantity: finalQuantity, unit: item.unit, status: 'UPDATED' };
    }

  } catch (error) {
    console.error("Error en toggleIngredient:", error);
    return { success: false, error: "Error actualitzant l'estoc." };
  }
}