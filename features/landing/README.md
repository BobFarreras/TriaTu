# Landing Feature

Objectiu:
Presentar la proposta de valor i facilitar l'entrada a l'app.

Responsabilitats:
- Hero i contingut introductori.
- CTA cap a registre o login.

Components clau:
- `LandingHero`, `TypewriterText`, `NavbarInstallbutton`

Estructura:
- `components/` UI de landing (hero, navbar, typewriter)
- `hooks/` (quan cal)
- `logic/` (sense dependencies d'infra)
- `__tests__/` (tests de feature)
- `index.ts` (exports publices)

Flux principal:
Nomes UI (sense dependencies de domini).

Tests:
- Tests visuals/units si hi ha llogica.
