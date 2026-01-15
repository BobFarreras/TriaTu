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
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

> Nota: Mantingues les claus fora del control de versions.

## Scripts

- `pnpm dev` — entorn de desenvolupament.
- `pnpm build` — build de producció.
- `pnpm start` — arrencar build de producció.
- `pnpm lint` — lint.
- `pnpm test` — tests en mode watch.
- `pnpm test:ci` — tests en mode CI.

## Flux de treball (TDD)

1. Escriu el test (RED).
2. Implementa el cas d'ús (GREEN).
3. Implementa l'adapter necessari.
4. Connecta via container i server action.
5. Actualitza la UI.

## Arquitectura (recordatori)

- **UI** → **Application** → **Domain** ← **Infrastructure**
- Els use cases no depenen de Next.js.
- El domini no accedeix directament a infraestructura.

## Qualitat

- Executa `pnpm test:ci` abans de pujar canvis.
- Mantén la documentació actualitzada quan canviï l'arquitectura o l'API.
