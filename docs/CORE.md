# CORE.md

Objectiu
Documentar la capa core per mantenir Clean Architecture, coherència i decisions clares sobre on va cada cosa.

## Principis
- Core no pot importar React, Next ni Supabase.
- Domain és pur: entitats, value-objects i regles de negoci sense infraestructura.
- Use cases orquestren el flux i depenen de ports i domain.
- Application services poden usar utilitats compartides (p. ex. logger, presets) si no trenquen la regla d'or.

## Mapa de carpetes (core/)
- `core/domain/`
  - `entities/` entitats del negoci.
  - `value-objects/` objectes de valor (immutables).
  - `types/` tipus compartits de domini.
  - `services/` lògica de domini pura (sense I/O).
- `core/ports/`
  - Interfaces/contractes per repositoris i serveis externs.
- `core/usecases/`
  - Casos d'ús. Cada acció de negoci del sistema viu aquí.
- `core/application/`
  - `services/` serveis d'aplicació (orquestració, utilitats que poden usar `lib/`).
  - `schemas/` validacions/DTOs de capa application.
- `core/constants/`
  - Llistats i constants compartides per core.
- `core/prompts/`
  - Prompts de la IA (si el core els necessita).

## Regles de dependències
- `domain` no depèn de res fora de `core/`.
- `usecases` poden dependre de `domain` i `ports`.
- `application/services` poden dependre de `domain`, `ports`, `core/constants` i `lib/`.
- `adapters` i `app` mai importen directament de `domain` si hi ha un use case disponible.

## Nomenclatura
- Fitxers en PascalCase per classes (`GenerateMenuService.ts`).
- Evitar noms amb errors tipogràfics.
- Evitar duplicats de concepte (si existeix un use case, no crear-ne un de similar a `ports/`).

## Notes de reorg recent
- Serveis d'orquestració moguts a `core/application/services/`.
- `GetShoppingHistory` ara és un use case i viu a `core/usecases/shopping-list/`.
- `AddToShoppingListUseCase` (duplicat) eliminat; el use case actiu és `AddToShoppingList`.

## Com afegir nou codi
1) Crear o ajustar entitats a `core/domain/`.
2) Definir ports a `core/ports/` si cal I/O.
3) Escriure el use case a `core/usecases/`.
4) Afegir serveis d'aplicació a `core/application/services/` si cal orquestrar.
5) Actualitzar tests abans d'afegir UI.
