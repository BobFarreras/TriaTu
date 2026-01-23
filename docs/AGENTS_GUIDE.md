# Guia per Agents (Skills i Flux de Treball)

Objectiu: definir com han d'operar els agents dins de Triatu, amb especial atencio a skills, netedat d'arquitectura i qualitat.

## Regles base (obligatories)

- Llegeix `AGENTS.md` abans de tocar res.
- Respecta Clean Architecture (UI -> Application -> Domain <- Infrastructure).
- Valida inputs amb Zod abans de tocar infraestructura.
- No registris PII. Usa `lib/logger` i `debug` nomes en dev.
- Evita afegir funcionalitat sense cas d'us clar.

## Skills: quan i com usar-les

1) Identifica si el treball encaixa amb una skill existent.
2) Llegeix el `SKILL.md` corresponent abans d'actuar.
3) Usa scripts o assets de la skill si existeixen.
4) Si cal crear una skill nova, afegeix-la a `docs/skills/` i documenta-la.

Skills disponibles (resum):
- `docs/skills/triatu-architecture/`
- `docs/skills/triatu-dev-workflow/`
- `docs/skills/triatu-features/`
- `docs/skills/triatu-security/`
- `docs/skills/triatu-sentry/`
- `docs/skills/triatu-supabase/`
- `docs/skills/triatu-testing/`
- `docs/skills/triatu-langsmith-prompts/`

## Flux recomanat per agents

1) Revisa requisits i riscos.
2) Detecta si hi ha una skill aplicable i segueix-la.
3) Aplica TDD: test -> use case -> adapter -> UI.
4) Actualitza docs si canvia arquitectura o fluxos.
5) Executa `pnpm validate` abans d'entregar canvis.

## Git i governanca

- Segueix el workflow definit a `docs/GITHUB_WORKFLOW.md`.
- No facis merge ni push a `main`.
- Els PR sempre van a `develop` (o `release/*` en releases).
- L'agent s'atura com a maxim a `release/*`.

## Documents clau

- `AGENTS.md`
- `docs/DEVELOPMENT.md`
- `docs/CONTRIBUTING.md`
- `docs/GITHUB_WORKFLOW.md`
