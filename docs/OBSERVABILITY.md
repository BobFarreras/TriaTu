# Observabilitat (Sentry)

Objectiu
Disposar de visibilitat d'errors i rendiment sense exposar PII i sense hardcode de credencials.

## Variables d'entorn

Configura-les a `.env.local` (dev) i a l'entorn de produccio:

```
SENTRY_DSN=
SENTRY_ENVIRONMENT=development|staging|production
SENTRY_RELEASE=
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.0
```

## Abast recomanat

- Server Actions (errors i latencies).
- Route handlers (API).
- Processos en background si n'hi ha.
- Client només per errors UI crìtics.

## Etiquetes i context

Utilitza tags per entendre l'origen sense PII:

- `feature` (rooms, inventory, recipes, shoppingList)
- `use_case` (nom del cas d'us)
- `action` (server action)

## Privacitat

- No enviar emails, noms o payloads sencers.
- Redactar camps sensibles abans d'enviar a Sentry.
- Logs amb `lib/logger` i `debug` només en dev.

## Alertes

Configura alertes per:
- increments sobtats d'errors
- errors 5xx repetits
- latencies elevades en accions crítiques

## Documents relacionats

- `docs/SECURITY.md`
- `docs/DEVELOPMENT.md`
