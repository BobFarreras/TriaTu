# Tests - Estructura

Objectiu:
Mantenir els tests separats per capa de l'arquitectura i facilitar la cerca.

Estructura actual:
- `tests/core/` tests de domini i use cases del core.
- `tests/usecases/` use cases d'aplicacio (orquestracio).
- `tests/adapters/` adaptadors d'infra (Supabase, IA, middleware).
- `tests/services/` serveis de domini o d'aplicacio.
- `tests/infrastructure/` fluxos amb repositoris reals o integracio local.
- `tests/components/` components compartits (UI).
- `tests/actions/` server actions.
- `tests/security/` validacions i seguretat.

Tests de feature (UI):
- Cada feature te el seu `__tests__/` dins `features/<feature>/__tests__/`.

Notes:
- No barregis tests de domini amb UI.
- Si un test necessita mocks de Next, revisa `vitest.setup.ts`.
