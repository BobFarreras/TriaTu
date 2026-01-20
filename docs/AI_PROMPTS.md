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
