# Contribució

Gràcies per voler contribuir a Triatu. Aquest document defineix el flux de treball i els requisits.

## Principis del projecte

- Simplicitat, mantenibilitat i claredat mental.
- Clean Architecture obligatòria.
- TDD obligatori: primer test, després codi.

## Flux de treball recomanat

1) Crea una branca.
2) Escriu tests per al cas d'ús.
3) Implementa la lògica al core (sense dependències de framework).
4) Afegeix adapters, container i Server Actions.
5) Actualitza la UI (si cal).
6) Actualitza la documentació afectada.
7) Executa `pnpm test:ci` i `pnpm lint`.

## Estil i arquitectura

- No afegir funcionalitat sense cas d'ús clar.
- No accedir directament a infraestructura des del domini.
- No usar estats globals no justificats (Zustand només per UI efímera).
- Use cases independents del framework.

## Commits i PR

- Fes commits atòmics.
- Inclou un resum clar del canvi i l'impacte.
- Adjunta evidència de tests.

## Documentació

Si el canvi altera fluxos, entitats o ports, actualitza:

- `docs/DEVELOPMENT.md`
- `guia.md`
- `arquitectura_triatu.md`

I registra els canvis a `docs/PROJECT_AUDIT.md` si hi ha nou deute tècnic o risc.

