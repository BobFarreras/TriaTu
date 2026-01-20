# Profile Feature

Objectiu:
Gestionar el perfil de preferencies de l'usuari.

Responsabilitats:
- Formulari de preferencies.
- Validacio abans d'enviar a server actions.

Components clau:
- `ProfileContent`, `ProfileFrom`

Flux principal:
UI -> `updateProfileAction` -> Use Case `UpdateUserProfile`.

Tests:
- `tests/usecases/UpdateUserProfile.test.ts`.
