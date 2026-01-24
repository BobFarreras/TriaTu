# Triatu
## Guia d'Arquitectura, Desenvolupament i Governança

> Objectiu: definir què fa l'app, com es construeix i com es manté amb criteris professionals (Clean Architecture, TDD i simplicitat).

---

## 1. Visió de producte

**Problema que resol**
Fatiga de decisions quotidianes (menjar, descans, llistes i hàbits).

**Proposta de valor**
Delegar microdecisions no crítiques per reduir càrrega mental.

**Principi clau**
> No optimitzar la vida. Simplificar-la.

---

## 2. Principis no negociables

- L'usuari manté el control final.
- Una decisió = una resposta (mai llistes interminables).
- Simplicitat > complexitat d'IA.
- Validació d'inputs abans d'infraestructura.
- Evitar logs amb PII (usar `lib/logger`, `debug` només en dev).

---

## 3. Arquitectura general (Clean Architecture)

```
UI (Next.js)
  -> Application (Use Cases + Services)
    -> Domain (Core)
    <- Infrastructure (Supabase, IA, Realtime)
```

**Regla d'or:** les capes externes no poden afectar les internes.

---

## 4. Estructura real del projecte

```
/adapters
  /ai, /openai, /gemini, /strategies, /supabase
/app
  /actions, /api, /... routes
/components
/context
/core
  /application, /constants, /domain, /ports, /prompts, /usecases
/docs
/features
  /dashboard, /decision, /inventory, /landing, /profile, /ranking, /recipes, /rooms, /shoppingList
/hooks
/lib
/services
/tests
```

---

## 5. Model feature-first

Cada feature viu a `features/<feature>` amb la seva pròpia estructura i README:

```
features/<feature>/
  components/
  hooks/
  logic/
  __tests__/
  index.ts
  README.md
```

Els components compartits viuen a `components/` (sobretot `components/ui`).

---

## 6. Flux d'una acció (exemple real)

1) **UI**: un component de `features/` crida una Server Action.
2) **Server Action**: valida amb Zod i obté usuari.
3) **Use Case**: aplica lògica de domini.
4) **Adapter**: persisteix a Supabase o crida IA.
5) **UI**: renderitza resultat.

Nota d'UX: el tour d'onboarding de decisions individuals s'inicia manualment amb `TourTrigger` (sense auto-start).
Nota IA: els prompts es resolen via `PromptService` amb LangSmith i fallback local.
Nota productes: el filtratge de cerques de catàleg passa per `ProductSearchFilter` (Application) per mantenir coherència entre inventory i receptes, amb bloqueig per secció; la cerca manual fa fallback per termes i ofereix un item manual amb emoji si no hi ha resultats; tokens curts clau actuen com a àncores per evitar falsos positius; el linker d'ingredients fa servir `SearchQueryBuilder` per expandir queries; el modal de cost permet cerca manual per ingredient.
Nota rooms: la unió a sales accepta enllaç d'invitació o ID; l'host pot copiar l'ID des dels ajustos.
Nota receptes: el tour de l'editor és accessible a crear i editar; s'auto-activa el primer cop, simula el flux complet i fa servir productes mock al càlcul de costos.

---

## 7. Testing (TDD obligatori)

- Unit i use cases: Vitest.
- E2E: Playwright (tests a `tests/e2e`).
- L'ordre és: tests -> use case -> adapter -> UI.

---

## 8. Seguretat

- RLS a Supabase.
- Rate limiting en accions crítiques.
- Logs de seguretat centralitzats (adapter de seguretat).

---

## 9. Governança i documentació

- Qualsevol canvi d'arquitectura o flux ha d'actualitzar:
  - `guia.md`
  - `arquitectura_triatu.md`
  - `docs/PROJECT_AUDIT.md` (riscos o deute)

---

## 10. Referències

- `guia.md`
- `docs/CORE.md`
- `docs/DEVELOPMENT.md`
- `docs/SECURITY.md`
- `docs/skills/`
- `docs/GITHUB_WORKFLOW.md`
- `docs/AGENTS_GUIDE.md`
- `docs/releases/README.md`
