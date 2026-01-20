# Guia de desenvolupament

## Prerequisits

- Node.js 20+
- pnpm
- Supabase (projecte i claus d'acces)

## Configuracio d'entorn

Crea `.env.local` amb les variables necessaries (les claus exactes es consulten als adapters i serveis):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

> Nota: Mantingues les claus fora del control de versions.

## Scripts

- `pnpm dev` - entorn de desenvolupament.
- `pnpm build` - build de produccio.
- `pnpm start` - arrencar build de produccio.
- `pnpm lint` - lint.
- `pnpm test` - tests.
- `pnpm test:ci` - tests en mode CI.
- `pnpm test:e2e` - tests end-to-end (Playwright).

## E2E (Playwright)

Variables d'entorn per executar login en e2e:

```
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:
- Sense aquestes variables, el test de login es marca com a "skipped".
- Playwright aixeca el servidor amb `pnpm dev` (port 3010).
- Playwright carrega `.env.local` automaticament.
- L'E2E fa servir `NEXT_PUBLIC_SUPABASE_URL` de `.env.local`.
- El mode E2E desactiva el Tour al dashboard amb `NEXT_PUBLIC_E2E=true`.
- Pots sobreescriure la URL amb `PLAYWRIGHT_BASE_URL`.

## Flux de treball (TDD)

1. Escriu el test (RED).
2. Implementa el cas d'us (GREEN).
3. Implementa l'adapter necessari.
4. Connecta via container i server action.
5. Actualitza la UI.

## Logs i seguretat

- No registris PII en logs. Usa `lib/logger` i `debug` nomes en dev.
- Valida inputs amb Zod abans de tocar infraestructura.

## Documentacio

- Si canvies arquitectura o fluxos, actualitza `guia.md` i `arquitectura_assistent_de_decisions_quotidianes.md`.
- Cada feature ha de tenir un `README.md` amb objectiu, components i flux.

## Arquitectura (recordatori)

- **UI** -> **Application** -> **Domain** <- **Infrastructure**
- Els use cases no depenen de Next.js.
- El domini no accedeix directament a infraestructura.

## Qualitat

- Executa `pnpm test:ci` abans de pujar canvis.
- Manten la documentacio actualitzada quan canvii l'arquitectura o l'API.
