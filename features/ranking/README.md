# Feature: Ranking

Objectiu:
Visualitzar el ranking de receptes o usuaris segons el domini.

Responsabilitats:
- Llista de ranking i podi.
- Estadistiques i visualitzacio.

Components clau:
- `RankingView`, `RankingPodium`, `RankingList`.
- `RankingInfoDialog` (explica la puntuacio amb modal).

Estructura:
- `components/` UI de ranking.
- `hooks/` (quan cal).
- `logic/` (sense dependencies d'infra).
- `__tests__/` (tests de feature).
- `index.ts` (exports publics).

Flux principal:
UI -> Server Components (`app/ranking/page.tsx`) -> Repositoris.

Logica clau:
- `sumRankingScore` agrega `qualityScore`, `pantryScore`, `communityScore` (valors absents = 0).
- `RankingInfoDialog` es mostra via `TourTrigger` per explicar la puntuacio.
- `RankingView` carrega el podi i la primera pagina, i fa load-more via `/api/ranking`.

Tests:
- `features/ranking/__tests__/score.test.ts` valida la suma de puntuacions.

Docs:
- `docs/ranking.md`
