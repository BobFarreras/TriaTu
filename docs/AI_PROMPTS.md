# Prompts IA (LangSmith)

Objectiu
Treure prompts del codi i gestionar versions amb LangSmith per millorar control, auditoria i iteracio.

## Variables d'entorn

Configura-les a `.env.local` (dev) i a l'entorn de produccio:

```
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=triatu-nextjs
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

## Prompts de Triatu (noms)

- `triatu-scan`
- `triatu-recipe-chef`
- `triatu-recipe-fate`

Variables habituals:
- `triatu-scan`: `today`
- `triatu-recipe-chef` i `triatu-recipe-fate`: `count`, `mode`, `vibe`, `restrictions`, `language`, `inventoryList`, `focusDish`

## Estrategia

- Prompts versionats a LangSmith (nom + versio).
- El codi guarda noms/IDs de prompt, no el text.
- Cache local per evitar peticions constants.
- Fallback a `core/prompts/` en mode offline o errors de xarxa.

## Bones practiques

- Variables de prompt clares i tipades.
- No incloure PII als prompts.
- Registrar (sense contingut) el prompt utilitzat i la versio.
- Validar canvis de prompt amb tests de regressio.

## Proposta d'estructura

- `core/prompts/` per defaults locals.
- LangSmith com a font de veritat en produccio.

## Documents relacionats

- `docs/SECURITY.md`
- `docs/DEVELOPMENT.md`

## Guia rapida (UI LangSmith)

1) Crea o obre el projecte de LangSmith.
2) Afegeix un prompt amb el nom exacte (veure llista).
3) Defineix el template amb variables `{{variable}}`.
4) Desa i versiona els canvis.
5) Actualitza `docs/releases/vX.Y.Z.md` quan canviis prompts en produccio.
