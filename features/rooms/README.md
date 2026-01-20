# Rooms Feature

Objectiu:
Gestionar sales de decisions de grup.

Responsabilitats:
- Creacio i unio a sales.
- Resolucio de decisions i historial.

Estructura:
- `components/` UI de sales.
- `hooks/` hooks de realtime i simulacio.
- `logic/` tipus i helpers de la feature.
- `__tests__/` tests locals de la feature.
- `index.ts` exports publicats.

Components clau:
- `RoomDetail`, `DecisionControls`, `ParticipantsDock`.

Flux principal:
UI -> `room-actions` -> Use Cases -> Repositoris.

Tests:
- `tests/usecases/*Room*` i `tests/actions/joinRoom.test.ts`.
