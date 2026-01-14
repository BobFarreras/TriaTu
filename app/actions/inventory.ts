// ARXIU: src/app/actions/inventory.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container'; // ✅ Importem el contenidor
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { FOOD_PRESETS } from '@/lib/food-presets';

import {
  InventoryItemSchema,
  ConsumeItemSchema,
} from '@/core/application/schemas/inputSchemas';
// Definim què retornem a la UI (Serialitzable, sense classes)
export interface ProductResult {
  id: string; // El nostre ID de Supabase o temporal
  name: string;
  price: number;
  image: string;
  source: string;
  emoji: string;
  tags: string[];
}
// --- HELPERS (Es queden igual) ---
function calculateExpiryDate(name: string, emoji?: string): Date | undefined {
  const now = new Date();
  const preset = FOOD_PRESETS.find(p =>
    p.name.toLowerCase() === name.toLowerCase() ||
    (emoji && p.emoji === emoji)
  );
  if (preset) {
    const result = new Date();
    result.setDate(now.getDate() + preset.expirationDays);
    return result;
  }
  return undefined;
}

const BatchInventorySchema = z.array(InventoryItemSchema.omit({ userId: true }));
function getZodError(error: z.ZodError<unknown>): string { return error.issues[0]?.message || "Dades invàlides"; }
function getErrorMessage(error: unknown): string { return error instanceof Error ? error.message : String(error); }

// ------------------------------------------------------------------
// 1. ADD ITEM
// ------------------------------------------------------------------
export async function addItemAction(formData: FormData) {
  try {
    // 1. Obtenim el client (essencial per seguretat)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 2. Processem dades (Form Data Parsing)
    const expiryRaw = formData.get('expiryDate');
    const expiryString = (expiryRaw && expiryRaw !== '' && expiryRaw !== 'null' && expiryRaw !== 'undefined')
      ? String(expiryRaw) : undefined;
    // 🔴 LOG 1: Què arriba cru del formulari?
    const rawProductId = formData.get('productId');
    console.log("🔍 [ACTION] Raw productId from FormData:", rawProductId);
    const rawData = {
      userId: user.id,
      name: formData.get('name'),
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit'),
      location: formData.get('location'),
      expiryDate: expiryString,
      emoji: formData.get('emoji'),
      // ✅ AFEGIT: Llegim el productId del formData
      productId: formData.get('productId')
        ? String(formData.get('productId'))
        : null
    };

    // 🔴 LOG 2: Què passem a Zod?
    console.log("🔍 [ACTION] Data entering Zod:", rawData);

    const validation = InventoryItemSchema.safeParse(rawData);

    if (!validation.success) {
      console.error("❌ [ACTION] Zod Validation Error:", validation.error);
      return { success: false, error: getZodError(validation.error) };
    }

    // 🔴 LOG 3: Què ha sortit de Zod? (Si aquí productId falta, és culpa de l'Schema)
    console.log("🔍 [ACTION] Data after Zod parse:", validation.data);

    const finalData = validation.data;
    let finalExpiryDate = expiryString ? new Date(expiryString) : undefined;
    if (!finalExpiryDate) {
      finalExpiryDate = calculateExpiryDate(String(finalData.name), String(finalData.emoji));
    }

    // ✅ 3. USEM EL CONTENIDOR (Li passem el client i ell ens dona el UseCase llest)
    const useCase = container.getAddItem(supabase);

    await useCase.execute({
      userId: user.id,
      name: String(finalData.name),
      quantity: Number(finalData.quantity),
      unit: String(finalData.unit),
      location: finalData.location as StorageLocation,
      expiryDate: finalExpiryDate,
      emoji: String(finalData.emoji || '📦'),
      addedAt: new Date(),
      productId: finalData.productId
    });

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 2. CONSUME ITEM
// ------------------------------------------------------------------
export async function consumeItemAction(itemId: string, amount: number) {
  try {
    const validation = ConsumeItemSchema.safeParse({ itemId, amount });
    if (!validation.success) return { success: false, error: getZodError(validation.error) };

    const supabase = await createClient(); // 1. Client
    const useCase = container.getConsumeItem(supabase); // 2. Container

    await useCase.execute(validation.data.itemId, validation.data.amount);

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 3. UPDATE ITEM
// ------------------------------------------------------------------
interface UpdateItemDTO { id: string; name: string; quantity: number; unit: string; emoji: string; expiryDate?: Date | null; location?: string; }

export async function updateItemAction(item: UpdateItemDTO) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    if (!item.id || !item.name) throw new Error("Dades incompletes");

    const useCase = container.getUpdateItem(supabase); // ✅ Container

    await useCase.execute({
      id: item.id,
      userId: user.id,
      name: item.name,
      emoji: item.emoji || '📦',
      quantity: item.quantity,
      unit: item.unit,
      location: (item.location as StorageLocation) || StorageLocation.PANTRY,
      expiryDate: item.expiryDate ? item.expiryDate : undefined,
      addedAt: new Date()
    });

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 4. DELETE ITEM
// ------------------------------------------------------------------
export async function deleteItemAction(itemId: string) {
  try {
    if (!itemId) return { success: false, error: "ID invàlid" };

    const supabase = await createClient();
    const useCase = container.getDeleteItem(supabase); // ✅ Container

    await useCase.execute(itemId);

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 5. BULK ADD ITEMS
// ------------------------------------------------------------------
export async function addBatchItemsAction(items: z.infer<typeof BatchInventorySchema>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const validation = BatchInventorySchema.safeParse(items);
    if (!validation.success) return { success: false, error: getZodError(validation.error) };

    // ✅ Aquí necessitem el Repositori directament, no un UseCase.
    // El contenidor també ens el pot donar!
    const repo = container.getInventoryRepo(supabase);

    const entities = validation.data.map(d => {
      let finalDate = d.expiryDate ? new Date(d.expiryDate) : undefined;
      if (!finalDate) {
        finalDate = calculateExpiryDate(d.name, d.emoji);
      }

      return InventoryItem.create({
        id: crypto.randomUUID(),
        userId: user.id,
        name: d.name,
        quantity: d.quantity,
        unit: d.unit,
        location: d.location as StorageLocation,
        expiryDate: finalDate,
        emoji: d.emoji || '📦',
        addedAt: new Date(),
        productId: d.productId

      });
    });

    await repo.saveBatch(entities);

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) {
    console.error('Error in addBatchItemsAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }

}
// ✅ MODIFICAT: Afegim paràmetre 'emoji' (opcional)
export async function quickAddInventoryAction(
  name: string,
  quantity: number,
  unit: string,
  emoji?: string // <--- NOU PARÀMETRE
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 1. Lògica intel·ligent per l'emoji
    // Si ve del front, l'usem. Si no, busquem a presets. Si no, default.
    let finalEmoji = emoji;
    if (!finalEmoji) {
      const preset = FOOD_PRESETS.find(p => p.name.toLowerCase() === name.toLowerCase());
      finalEmoji = preset?.emoji || '📦';
    }

    const expiryDate = calculateExpiryDate(name, finalEmoji);
    const useCase = container.getAddItem(supabase);

    await useCase.execute({
      userId: user.id,
      name: name,
      quantity: quantity,
      unit: unit,
      location: StorageLocation.PANTRY,
      expiryDate: expiryDate,
      emoji: finalEmoji, // ✅ Usem l'emoji correcte
      addedAt: new Date(),
      productId: null
    });

    revalidatePath('/inventory');
    revalidatePath('/recipes');
    return { success: true };

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function searchProductsAction(query: string): Promise<{ success: boolean, data?: ProductResult[], error?: string }> {
  if (!query || query.length < 3) {
    return { success: true, data: [] };
  }

  try {
    // 1. Obtenim client segur
    const supabase = await createClient();

    // 2. Injectem dependències (Aquí passa la màgia de la Cache)
    const searcher = container.getSearchAndCacheProducts(supabase);

    // 3. Executem (Supabase? O Bonpreu? No ens importa!)
    const products = await searcher.execute(query);

    // 4. Convertim Entitats de Domini -> Objectes Simples per a React
    // (React no li agraden les classes amb mètodes a les props)
    const serialized = products.map(p => ({
      id: p.props.id,
      name: p.props.name,
      price: p.props.price,
      image: p.props.image,
      source: p.props.source,
      emoji: p.props.emoji,
      tags: p.props.tags
    }));

    return { success: true, data: serialized };

  } catch (error) {
    console.error("Error cercant productes:", error);
    return { success: false, error: "No s'ha pogut completar la cerca." };
  }
}

// Afegeix aquesta funció nova:
export async function deleteBatchItemsAction(ids: string[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const repo = container.getInventoryRepo(supabase);
    
    // Assumim que el teu repo té un mètode batchDelete. 
    // Si no el tens al repo, fes un bucle de delete (més lent però funciona)
    // O implementa batchDelete(ids) al Repository com vam veure abans.
    await repo.batchDelete(ids); 

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}