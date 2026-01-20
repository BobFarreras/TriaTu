# Dashboard Feature

Objectiu:
Mostrar una visio resum de l'estat de l'usuari i les seves sales actives.

Responsabilitats:
- Renderitzar resum d'activitat i navegacio principal.
- Mostrar llistes d'elements clau (sales actives, accions rapides).

Estructura:
- `components/` UI del dashboard.
- `hooks/` hooks de la feature.
- `logic/` tipus i helpers de la feature.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publicats.

Components clau:
- `DashboardHeader`, `DashboardContent`, `ActiveRoomsList`.

Flux principal:
UI -> Server Actions (si cal) -> Use Cases -> Repositoris.

Tests:
- Tests de components a `tests/components` i tests locals quan apliqui.
