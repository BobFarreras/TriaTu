# Feature: Rooms

Objectiu:
Gestionar sales de decisions i compartir context (inventari o llista de la compra).

Responsabilitats:
- Crear i unir-se a sales.
- Activar o desactivar features compartides.
- Mostrar participants i historial.

Estructura:
- `components/` UI de sales.
- `hooks/` hooks de realtime i helpers.
- `logic/` tipus i helpers locals.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publics.

Components clau:
- `RoomDetail`, `DecisionControls`, `ParticipantsDock`, `RoomFeaturesPanel`.

Flux principal:
UI -> `app/actions/room-actions` -> Use Cases -> Repositoris.

Tests:
- `tests/usecases/*Room*` i `tests/actions/*room*`.
