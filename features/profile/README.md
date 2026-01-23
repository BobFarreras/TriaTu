# Feature: Perfil

Objectiu:
Gestionar el perfil de preferencies de l'usuari.

Responsabilitats:
- Formulari de preferencies.
- Validacio abans d'enviar a Server Actions.

Components clau:
- `ProfileContent`, `ProfileForm`.

Estructura:
- `components/` UI del perfil (formulari i targetes).
- `hooks/` (quan cal).
- `logic/` (validacions/transformacions locals).
- `__tests__/` (tests de feature).
- `index.ts` (exports publics).

Flux principal:
UI -> `updateProfileAction` -> Use Case `UpdateUserProfile`.

Tests:
- `tests/usecases/UpdateUserProfile.test.ts`.
