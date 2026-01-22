// ARXIU: src/app/actions/inventory.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryItem } from '@/core/domain/entities/InventoryItem'; // Assegura't que l'Entity ja té roomId al constructor!
import { FOOD_PRESETS } from '@/lib/food-presets';
import { ExpirySafetyService } from '@/core/application/services/ExpirySafetyService';
import { EmojiMatcherService } from '@/core/application/services/EmojiMatcherService';
import { Product } from '@/core/domain/entities/Product';
import { logActionError } from '@/lib/observability/action-logger';
import { getCurrentUser } from '@/lib/auth/session';
import {
  InventoryItemSchema,
  ConsumeItemSchema,
} from '@/core/application/schemas/inputSchemas';

// Definim què retornem a la UI (Serialitzable, sense classes)
export interface ProductResult {
  id: string;
  name: string;
  price: number;
  image: string;
  source: string;
  emoji: string;
  tags: string[];
  quantityAmount?: number;
  quantityUnit?: string;
}

// --- HELPERS ---
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

// Actualitzem l'schema per acceptar roomId
const BatchInventorySchema = z.array(InventoryItemSchema.omit({ userId: true }).extend({ roomId: z.string().optional() }));

function getZodError(error: z.ZodError<unknown>): string { return error.issues[0]?.message || "Dades invàlides"; }
function getErrorMessage(error: unknown): string { return error instanceof Error ? error.message : String(error); }

// ------------------------------------------------------------------
// 0. GET INVENTORY (NOVA ACCIÓ PER LLISTAR)
// ------------------------------------------------------------------
export async function getInventoryAction(roomId?: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  try {
    const repo = container.getInventoryRepo(supabase);
    // Cridem al nou mètode del repo que vam crear al pas anterior
    const items = await repo.findByContext(user.id, roomId);

    // Serialitzem dates per al client
    const serialized = items.map(i => ({
      ...i.toPrimitives(),
      expiryDate: i.expiryDate ? i.expiryDate.toISOString() : null,
      addedAt: i.addedAt.toISOString(),
      roomId: i.roomId || undefined
    }));

    return { success: true, data: serialized };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 1. ADD ITEM (Amb suport Room)
// ------------------------------------------------------------------
export async function addItemAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const supabase = await createClient();
    const name = String(formData.get('name') || 'Producte');
    let emoji = formData.get('emoji')?.toString() || '📦';
    const roomId = formData.get('roomId')?.toString() || undefined; // <--- LLEGIM EL CONTEXT

    // ENRIQUIMENT EMOJI
    if (emoji === '📦' || emoji === '🛒') {
      const betterEmoji = EmojiMatcherService.getEmoji(name);
      if (betterEmoji !== '📦') emoji = betterEmoji;
    }

    const location = String(formData.get('location') || 'PANTRY');
    let expiryString = formData.get('expiryDate')?.toString();

    // SEGURETAT DATA
    if (!expiryString || expiryString === 'null' || expiryString === 'undefined' || expiryString === '') {
      const safeDateYMD = ExpirySafetyService.applySafetyRules(name, location, undefined);
      expiryString = new Date(safeDateYMD).toISOString();
    }

    const rawData = {
      userId: user.id,
      name: name,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit'),
      location: location,
      expiryDate: expiryString,
      emoji: emoji,
      productId: formData.get('productId') && formData.get('productId') !== 'null'
        ? String(formData.get('productId'))
        : null,
      roomId: roomId // <--- PASSEM EL ROOM ID AL VALIDATOR
    };

    // Necessitem estendre l'schema base per acceptar roomId si no ho fa
    const validation = InventoryItemSchema.extend({ roomId: z.string().optional() }).safeParse(rawData);

    if (!validation.success) {
      return { success: false, error: getZodError(validation.error) };
    }

    const finalData = validation.data;
    const finalExpiryDate = finalData.expiryDate ? new Date(finalData.expiryDate) : undefined;

    // USEM EL REPO DIRECTAMENT (O UseCase actualitzat)
    // Per simplificar i evitar tocar 10 arxius de UseCase, aquí cridarem al Repo,
    // ja que AddItemUseCase potser no espera roomId.
    // L'ideal seria actualitzar AddItemUseCase, però com que el Repo ja és llest:
    const repo = container.getInventoryRepo(supabase);

    const newItem = InventoryItem.create({
      id: crypto.randomUUID(),
      userId: user.id,
      roomId: finalData.roomId || null, // <--- AQUI ES GUARDA LA MAAGIA
      name: String(finalData.name),
      quantity: Number(finalData.quantity),
      unit: String(finalData.unit),
      location: finalData.location as StorageLocation,
      expiryDate: finalExpiryDate,
      emoji: String(finalData.emoji),
      addedAt: new Date(),
      productId: finalData.productId
    });

    await repo.save(newItem);

    revalidatePath('/dashboard/inventory');
    if (roomId) revalidatePath(`/rooms/${roomId}`); // Revalidar sala si cal

    return { success: true };

  } catch (error: unknown) {
    logActionError('addItemAction', 'Error fatal a addItemAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 2. CONSUME ITEM (Sense canvis, l'ID és únic)
// ------------------------------------------------------------------
export async function consumeItemAction(itemId: string, amount: number) {
  try {
    const validation = ConsumeItemSchema.safeParse({ itemId, amount });
    if (!validation.success) return { success: false, error: getZodError(validation.error) };

    const supabase = await createClient();
    const useCase = container.getConsumeItem(supabase);
    // El UseCase només necessita l'ID. El Repo trobarà l'item sigui de sala o usuari.
    await useCase.execute(validation.data.itemId, validation.data.amount);

    // ✅ AFEGEIX AIXÒ AL FINAL DE TOT:
    // Això obliga a Next.js a refrescar les dades de la ruta /inventory automàticament
    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 3. UPDATE ITEM
// ------------------------------------------------------------------
interface UpdateItemDTO { id: string; name: string; quantity: number; unit: string; emoji: string; expiryDate?: Date | null; location?: string; roomId?: string; }

export async function updateItemAction(item: UpdateItemDTO) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const supabase = await createClient();
    if (!item.id || !item.name) throw new Error("Dades incompletes");

    const repo = container.getInventoryRepo(supabase);

    // Recuperem l'item original per no perdre el roomId
    const existing = await repo.findById(item.id);
    if (!existing) throw new Error("Item not found");

    // Creem la nova versió (Immutable)
    const updated = InventoryItem.create({
      ...existing.toPrimitives(), // Mantenim dades velles (com addedAt, roomId, userId)
      name: item.name,
      emoji: item.emoji || '📦',
      quantity: item.quantity,
      unit: item.unit,
      location: (item.location as StorageLocation) || StorageLocation.PANTRY,
      expiryDate: item.expiryDate || undefined,
      // roomId es manté de l'original a toPrimitives(), o el pots forçar si volguessis moure'l
    });

    await repo.save(updated);

    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 4. DELETE ITEM (Igual)
// ------------------------------------------------------------------
export async function deleteItemAction(itemId: string) {
  try {
    if (!itemId) return { success: false, error: "ID invàlid" };

    const supabase = await createClient();
    // Aquí podríem usar el Repo directament també
    const useCase = container.getDeleteItem(supabase);
    await useCase.execute(itemId);

    revalidatePath('/dashboard/inventory');
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
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const supabase = await createClient();
    const validation = BatchInventorySchema.safeParse(items);
    if (!validation.success) return { success: false, error: getZodError(validation.error) };

    const repo = container.getInventoryRepo(supabase);

    const entities = validation.data.map(d => {
      let finalDate = d.expiryDate ? new Date(d.expiryDate) : undefined;
      if (!finalDate) {
        finalDate = calculateExpiryDate(d.name, d.emoji);
      }

      return InventoryItem.create({
        id: crypto.randomUUID(),
        userId: user.id,
        roomId: d.roomId || null, // <--- AQUI TAMBÉ
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

    revalidatePath('/dashboard/inventory');
    return { success: true };

  } catch (error: unknown) {
    logActionError('addBatchItemsAction', 'Error in addBatchItemsAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 6. QUICK ADD
// ------------------------------------------------------------------
export async function quickAddInventoryAction(
  name: string,
  quantity: number,
  unit: string,
  emoji?: string,
  productId?: string,
  roomId?: string // <--- NOU PARÀMETRE
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = await createClient();
    const expiryYMD = ExpirySafetyService.applySafetyRules(name, 'PANTRY', undefined);
    const expiryDate = new Date(expiryYMD);

    const repo = container.getInventoryRepo(supabase);

    const newItem = InventoryItem.create({
      id: crypto.randomUUID(),
      userId: user.id,
      roomId: roomId || null, // <--- GUARDEM
      name: name,
      quantity: quantity,
      unit: unit,
      location: StorageLocation.PANTRY,
      expiryDate: expiryDate,
      emoji: emoji || '📦',
      addedAt: new Date(),
      productId: productId || null
    });

    await repo.save(newItem);

    revalidatePath('/dashboard/inventory');
    return { success: true };

  } catch (error) {
    logActionError('quickAddInventoryAction', 'Error quick adding to inventory:', error);
    return { success: false, error: "Error afegint a l'inventari." };
  }
}

// ------------------------------------------------------------------
// 7. SEARCH (Igual, no depèn de la sala)
// ------------------------------------------------------------------
export async function searchProductsAction(query: string): Promise<{ success: boolean, data?: ProductResult[], error?: string }> {
  if (!query || query.length < 3) return { success: true, data: [] };

  try {
    const supabase = await createClient();
    const searcher = container.getSearchAndCacheProducts(supabase);
    const products = (await searcher.execute(query)) as Product[];

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
    logActionError('searchProductsAction', 'Error cercant productes:', error);
    return { success: false, error: "No s'ha pogut completar la cerca." };
  }
}

// ------------------------------------------------------------------
// 8. DELETE BATCH (Igual)
// ------------------------------------------------------------------
export async function deleteBatchItemsAction(ids: string[]) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const supabase = await createClient();
    const repo = container.getInventoryRepo(supabase);
    await repo.batchDelete(ids);

    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
