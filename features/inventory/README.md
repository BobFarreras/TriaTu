# Feature: Inventari

Objectiu:
Gestionar l'inventari personal o compartit d'un usuari (items, quantitats i caducitats).

Responsabilitats:
- Afegir, editar i consumir items d'inventari.
- Integrar catalog de productes i escaneig quan cal.
- Suportar context personal o de sala.

Estructura:
- `components/` UI d'inventari.
- `actions/`, `dashboard/`, `products/` submoduls de la feature.
- `hooks/` hooks de la feature.
- `logic/` tipus i helpers locals.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publics.

Components clau:
- `InventoryManager`, `InventoryHeader`, `InventoryList`, `InventoryItemCard`.
- Scanner compartit a `components/scanner`.

Flux principal:
UI -> `app/actions/inventory` -> Use Cases/Serveis -> Repositoris (Supabase).

Context compartit:
- L'inventari pot ser personal o de sala si el host activa `enable_inventory`.
- El selector de context permet canviar entre personal i sales habilitades.

Tests:
- `tests/usecases/*Inventory*` i tests de components quan apliqui.
