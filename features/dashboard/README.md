# Dashboard Feature

Objectiu:
Mostrar una visio resum de l'estat de l'usuari i les seves sales actives.

Responsabilitats:
- Renderitzar resum d'activitat i navegacio principal.
- Mostrar llistes d'elements clau (sales actives, accions rapides).

Components clau:
- `DashboardHeader`, `DashboardContent`
- `ActiveRoomsList`, `QuickActionsPanel`

Flux principal:
UI -> Server Actions (si cal) -> Use Cases -> Repositoris.

Tests:
- Tests de components a `tests/components`.
