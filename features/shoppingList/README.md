// ARXIU: docs/features/shoppingList

# Feature: Llista de la Compra Intel·ligent

## Descripció
Sistema que gestiona els ingredients que falten. Actua com a "fallback" quan l'inventari és insuficient.

## Arquitectura
- **Domini**: `ShoppingListItem` (Entitat).
- **Port**: `ShoppingListRepository` (Interface).
- **Adaptador**: `SupabaseShoppingListRepository` (Implementació).

## Regles de Negoci
1. **Unificació**: Si s'afegeix un producte que ja existeix (per nom, case-insensitive), no es crea un nou registre, sinó que se suma la quantitat al existent.
2. **Reactivació**: Si s'afegeix quantitat a un producte que estava marcat com "comprat" (checked), aquest torna a quedar pendent (unchecked).
3. **Persistència**: Totes les dades es guarden a Supabase sota la taula `shopping_list_items`.

## Ús Tècnic
Aquesta feature serà utilitzada principalment per:
- `AddToShoppingListUseCase` (nou).
- `CookRecipeUseCase` (quan faltin ingredients).
## Estructura
- components/ UI de la llista i historial
- hooks/ (quan cal)
- logic/ (sense dependencies d'infra)
- __tests__/ (tests de feature)
- index.ts (exports publices)
