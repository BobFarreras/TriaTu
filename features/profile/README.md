# Profile Feature

Objectiu:
Gestionar el perfil de preferencies de l'usuari.

Responsabilitats:
- Formulari de preferencies.
- Validacio abans d'enviar a server actions.

Components clau:
- `ProfileContent`, `ProfileFrom`

Estructura:
- `components/` UI del perfil (formulari i targetes)
- `hooks/` (quan cal)
- `logic/` (validacions/transformacions locals)
- `__tests__/` (tests de feature)
- `index.ts` (exports publices)

Flux principal:
UI -> `updateProfileAction` -> Use Case `UpdateUserProfile`.

Tests:
- `tests/usecases/UpdateUserProfile.test.ts`.
