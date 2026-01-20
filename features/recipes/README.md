# Feature: Receptes

Objectiu:
Crear, llistar i editar receptes, incloent contingut generat per IA.

Responsabilitats:
- Editor de receptes i feeds.
- Guardar, publicar i materialitzar receptes.
- Filtrar i cercar receptes.

Estructura:
- `components/` UI de receptes.
- `hooks/` hooks de la feature.
- `logic/` tipus i helpers locals.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publics.

Components clau:
- `RecipeGrid`, `RecipeDetailView`, `RecipeHeader`.
- Editor: `RecipeEditor`, `MetaControls`, `IngredientsManager`, `StepsBuilder`.
- Community: `RecipeFeed`, `FilterBar`, `CreateRecipeButton`.

Flux principal:
UI -> `app/actions/recipe-actions` -> Use Cases/Serveis -> Repositoris.

Tests:
- `tests/usecases/recipes/*` i tests de components quan apliqui.
