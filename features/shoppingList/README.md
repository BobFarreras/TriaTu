# Feature: Llista de la compra

Objectiu:
Gestionar els productes que falten i permetre una llista personal o compartida per sala.

Responsabilitats:
- Afegir i marcar items de compra.
- Crear sessions d'historial quan es completa la compra.
- Suportar context personal o de sala.

Estructura:
- `components/` UI de llista i historial.
- `hooks/` hooks de la feature.
- `logic/` tipus i helpers locals.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publics.

Components clau:
- `ShoppingListManager`, `ShoppingHeader`, `ShoppingListItem`, `ShoppingHistory`.

Flux principal:
UI -> `app/actions/shopping-list-actions` -> Use Cases/Serveis -> Repositoris.

Regles de negoci (resum):
- Unificacio per nom (case-insensitive).
- Reactivacio d'items marcats quan s'afegeix quantitat.
- Persistencia en `shopping_list_items` i sessions en `shopping_sessions`.

Context compartit:
- La llista pot ser personal o de sala si el host activa `enable_shopping_list`.
- El selector de context permet canviar entre personal i sales habilitades.

Tests:
- `tests/usecases/*Shopping*` i tests de components quan apliqui.
