# Rooms Feature

Objectiu:
Gestionar sales de decisions de grup.

Responsabilitats:
- Creacio i unio a sales.
- Resolucio de decisions i historial.

Components clau:
- `RoomDetail`, `DecisionControls`, `ParticipantsDock`

Flux principal:
UI -> `room-actions` -> Use Cases -> Repositoris.

Tests:
- `tests/usecases/*Room*` i `tests/actions/joinRoom.test.ts`.
