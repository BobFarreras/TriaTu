# Guia de desenvolupament

## Prerequisits

- Node.js 20+
- pnpm
- Supabase (projecte i claus d'accés)

## Configuració d'entorn

Crea `.env.local` amb les variables necessàries (les claus exactes es consulten als adapters i serveis):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ENVIRONMENT=development|staging|production
SENTRY_RELEASE=
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.0
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_TEST_ENABLED=false
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=triatu-nextjs
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

> Nota: mantingues les claus fora del control de versions.
> Prompts: veure `docs/AI_PROMPTS.md`.

## Scripts

- `pnpm dev` - entorn de desenvolupament.
- `pnpm build` - build de producció.
- `pnpm start` - arrencar build de producció.
- `pnpm lint` - lint.
- `pnpm test` - tests.
- `pnpm test:ci` - tests en mode CI.
- `pnpm test:e2e` - tests end-to-end (Playwright).
- `pnpm test:e2e:build` - e2e sobre build de produccio.
- `pnpm validate` - lint + test:ci + test:e2e:build.

## E2E (Playwright)

Variables d'entorn per executar login en e2e:

```
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:
- Sense aquestes variables, els tests que depenen d'admin es marquen com a "skipped".
- Playwright aixeca el servidor amb `pnpm dev --port 3010`.
- Playwright carrega `.env.local` automàticament.
- L'E2E fa servir `NEXT_PUBLIC_SUPABASE_URL` de `.env.local`.
- El mode E2E desactiva el Tour al dashboard amb `NEXT_PUBLIC_E2E=true`.
- Pots sobreescriure la URL amb `PLAYWRIGHT_BASE_URL`.

## Flux de treball (TDD)

1) Escriu el test (RED).
2) Implementa el cas d'ús (GREEN).
3) Implementa l'adapter necessari.
4) Connecta via container i Server Action.
5) Actualitza la UI.

## Logs i seguretat

- No registris PII en logs. Usa `lib/logger` i `debug` només en dev.
- Valida inputs amb Zod abans de tocar infraestructura.

## Documentació

- Si canvies arquitectura o fluxos, actualitza `guia.md` i `arquitectura_triatu.md`.
- Cada feature ha de tenir un `README.md` amb objectiu, components i flux.

## Arquitectura (recordatori)

- **UI** -> **Application** -> **Domain** <- **Infrastructure**
- Els use cases no depenen de Next.js.
- El domini no accedeix directament a infraestructura.

## Qualitat

- Executa `pnpm test:ci` abans de pujar canvis.
- Executa `pnpm validate` abans de PRs i merges importants.
- Per releases, afegeix notes a `docs/releases/vX.Y.Z.md`.
- Mantén la documentació actualitzada quan canvïi l'arquitectura o l'API.

