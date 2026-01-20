# Recipes Feature

Objectiu:
Crear, llistar i editar receptes, incloent contingut generat per IA.

Responsabilitats:
- Editor de receptes i feeds.
- Guardar, publicar i materialitzar receptes.

Components clau:
- `RecipeGrid`, `RecipeDetailView`, `RecipeEditor`

Flux principal:
UI -> `recipe-actions` -> Use Cases/Serveis -> Repositoris.

Tests:
- `tests/usecases/recipes/*` i tests de components quan apliqui.
