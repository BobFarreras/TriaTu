# Feature: Decisions Individuals

Objectiu:
Permetre als usuaris delegar una decisio simple (menjar, descans, social) i obtenir una resposta unica.

Responsabilitats:
- Recollir el context de l'usuari (energia, temps, preferencies).
- Executar el cas d'us corresponent i mostrar el resultat.

Estructura:
- `components/` UI de decisions.
- `hooks/` hooks de la feature.
- `logic/` tipus i helpers locals.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publics.

Components clau:
- `IndividualDecisionForm`, `DecisionResult` (si aplica).

Flux principal:
UI -> Server Actions -> Use Cases -> Repositoris/Resolvers.

Tests:
- Use cases a `tests/usecases/` i tests de components quan apliqui.
