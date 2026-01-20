# Feature: Ranking

Objectiu:
Visualitzar el ranking de receptes o usuaris segons el domini.

Responsabilitats:
- Llista de ranking i podi.
- Estadistiques i visualitzacio.

Components clau:
- `RankingView`, `RankingPodium`, `RankingList`.

Estructura:
- `components/` UI de ranking.
- `hooks/` (quan cal).
- `logic/` (sense dependencies d'infra).
- `__tests__/` (tests de feature).
- `index.ts` (exports publics).

Flux principal:
UI -> Server Actions (si cal) -> Repositoris.

Tests:
- Tests d'infra/repositoris relacionats.
