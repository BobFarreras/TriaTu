Com que m'has passat el codi actual, veig clarament on encaixar les peces. El teu InventoryItem ja té validacions de domini, però ara necessitem on guardar la Llista de la Compra quan no tinguem estoc.

Aquí tens el pla d'atac per aquest pas.

📂 Estat dels Arxius
Aquests són els arxius que tocarem o crearem. Revisa'ls abans de copiar.

🆕 NOU: core/domain/entities/ShoppingListItem.ts (Entitat de domini).

🆕 NOU: core/ports/ShoppingListRepository.ts (Interface / Port).

🆕 NOU: tests/infrastructure/SupabaseShoppingListRepository.test.ts (El Test TDD).

🆕 NOU: adapters/supabase/SupabaseShoppingListRepository.ts (Implementació).

🔄 ACTUALITZAR: esquema.sql (Afegir taula nova).

🆕 NOU: docs/features/shopping-list.md (Documentació).

1. Base de Dades (SQL)
Primer, preparem el terreny a Supabase. Necessitem una taula que suporti la llista, amb polítiques de seguretat (RLS) perquè cada usuari només vegi la seva.

SQL

-- // ARXIU: esquema.sql (Afegeix això al final)

-- 1. Taula per la llista de la compra
CREATE TABLE IF NOT EXISTS "public"."shopping_list_items" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    "name" text NOT NULL,
    "quantity" numeric NOT NULL DEFAULT 1,
    "unit" text NOT NULL DEFAULT 'ut',
    "is_checked" boolean DEFAULT false,
    "added_at" timestamptz DEFAULT now()
);

-- 2. Índexs per rendiment
CREATE INDEX IF NOT EXISTS shopping_list_user_idx ON "public"."shopping_list_items" ("user_id");

-- 3. Row Level Security (RLS)
ALTER TABLE "public"."shopping_list_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shopping list" 
ON "public"."shopping_list_items" FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own shopping list" 
ON "public"."shopping_list_items" FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping list" 
ON "public"."shopping_list_items" FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own shopping list" 
ON "public"."shopping_list_items" FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

--

Ara entrem al PAS 3: Application Layer (Casos d'Ús).

Aquí és on resoldrem el Problema 2 (Càlcul real 1kg - 200g) i prepararem el terreny pel Problema 1 (Falta d'estoc).

Crearem dos casos d'ús:

ConsumeIngredientUseCase: S'encarrega de restar quantitats exactes (matemàtiques de domini). Si no n'hi ha prou, llançarà l'error que hem definit abans.

AddToShoppingListUseCase: S'encarrega de l'acció de "fallback" (afegir el que falta a la llista).

📂 Nous Arxius
🆕 NOU: core/ports/InventoryRepository.ts (Contracte necessari pel UseCase).

🆕 NOU: tests/application/ConsumeIngredientUseCase.test.ts (TDD).

🆕 NOU: core/application/use-cases/ConsumeIngredientUseCase.ts (Lògica).

🆕 NOU: core/application/use-cases/AddToShoppingListUseCase.ts (Lògica).