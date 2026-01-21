# Feature: LangSmith Prompts

Objectiu:
Connectar els prompts a LangSmith amb fallback local a `core/prompts/`.

Responsabilitats:
- Obtenir prompts per nom i versio.
- Fer fallback a prompts locals si LangSmith falla.
- Evitar PII als logs.
- Cachejar per reduir latencia.

Flux principal (proposat):
UI -> Server Action -> Use Case -> PromptService -> Adapter LangSmith -> Fallback local.

Testing (TDD):
- Test de PromptService: recupera prompt remot.
- Test de fallback local si falla el remot.
- Test de cache (no repeteix peticio si es pot reutilitzar).

Notes:
- Variables d'entorn a `docs/DEVELOPMENT.md`.
- Observabilitat: errors a Sentry via `UseCaseError`.
