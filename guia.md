# Guia d'estructura

## 1. Objectiu

Aquest document descriu l'estructura del projecte, la responsabilitat de cada carpeta i el flux bàsic d'una acció.

## 2. Enciclopèdia de carpetes

### core/ (el cervell)
Lògica pura de negoci. No pot importar React, Next ni Supabase.

- `core/domain/`: entitats i regles de domini.
- `core/usecases/`: casos d'ús (orquestració del domini).
- `core/ports/`: contractes (interfaces) per infraestructura.
- `core/application/`: serveis d'aplicació i DTOs/schemas.
- `core/constants/`: constants compartides.
- `core/prompts/`: prompts de la IA si els use cases els requereixen.

### adapters/ (infraestructura)
Implementacions concretes dels ports.

- `adapters/supabase/`: repositoris i utilitats DB.
- `adapters/openai/`, `adapters/gemini/`, `adapters/ai/`: IA i parsing.
- `adapters/strategies/`: estratègies i fallback.

### services/
Injecció de dependències i wiring.

- `services/container.ts`: construcció d'instàncies i composició de use cases.

### app/ (Next.js)
Routes, Server Actions i pàgines (App Router).

- `app/actions/`: validació d'inputs, auth i crida a use cases.
- `app/.../page.tsx`: càrrega de dades i rendering.

### features/
UI per feature, amb estructura pròpia i README.

- `features/<feature>/{components,hooks,logic,__tests__,index.ts,README.md}`
- Features principals: `rooms`, `inventory`, `shoppingList`, `recipes`, `dashboard`, `profile`, `ranking`, `landing`, `decision`.

### components/
Components UI compartits i atòmics (`components/ui`).

### lib/
Utilitats compartides (logger, i18n, helpers).

### hooks/ i context/
Hooks o contextos globals compartits (només si són cross-feature).

### tests/
Tests per capes i tipus (veure `tests/README.md`).

## 3. El viatge d'una dada (exemple)

L'usuari prem un botó en una feature:

1) **UI (Client Component)**: recull dades i crida una Server Action.
2) **Server Action**: valida amb Zod, comprova auth i invoca un use case via container.
3) **Use Case (core/usecases)**: aplica la lògica de domini i demana dades als ports.
4) **Adapter (adapters/...)**: accedeix a Supabase o serveis externs.
5) **Resposta**: la UI mostra el resultat.

## 4. Flux de treball (TDD)

1) Escriu el test (RED).
2) Implementa el use case (GREEN).
3) Implementa l'adapter necessari.
4) Connecta via container i Server Action.
5) Actualitza la UI.

## 5. Notes de coherència

- Valida inputs amb Zod abans de tocar infraestructura.
- Evita logs amb PII; usa `lib/logger` i `debug` només en dev.
- Onboarding: el tour de decisions individuals s'activa manualment via `TourTrigger` (sense auto-start).
- Les cerques de productes passen per `ProductSearchFilter` (core/application/services) per garantir coherència i filtres comuns, incloent bloqueig per secció (categoria).
- A la cerca manual de productes, hi ha fallback per termes i un producte manual amb emoji si no hi ha resultats.
- Els tokens curts clau (ex: `pa`, `ou`, `vi`, `te`) actuen com a àncores per evitar falsos positius.
- El linker d'ingredients de receptes expandeix queries amb `SearchQueryBuilder` per millorar el match.
- El modal de cost de receptes permet cercar manualment productes per ingredient.
- Si canvies arquitectura o fluxos, actualitza `arquitectura_triatu.md`.
- Prompts IA: es resolen via `PromptService` (LangSmith + fallback local).

## 6. Documents clau

- `docs/GITHUB_WORKFLOW.md`
- `docs/AGENTS_GUIDE.md`
- `docs/skills/README.md`
- `docs/releases/README.md`

