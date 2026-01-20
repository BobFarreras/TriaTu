# Recipes Feature

Objectiu:
Crear, llistar i editar receptes, incloent contingut generat per IA.

Responsabilitats:
- Editor de receptes i feeds.
- Guardar, publicar i materialitzar receptes.

Estructura:
- `components/` UI de receptes.
- `hooks/` hooks de la feature.
- `logic/` tipus i helpers de la feature.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publicats.

Components clau:
- `RecipeGrid`, `RecipeDetailView`, `RecipeHeader`.
- Editor: `RecipeEditor`, `MetaControls`, `IngredientsManager`, `StepsBuilder`.
- Community: `RecipeFeed`, `FilterBar`, `CreateRecipeButton`.

Flux principal:
UI -> `recipe-actions` -> Use Cases/Serveis -> Repositoris.

Tests:
- `tests/usecases/recipes/*` i tests de components quan apliqui.
