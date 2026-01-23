# Seguretat

## Principis

- Validació estricta d'inputs (Zod) abans d'infraestructura.
- Rate limiting en accions crítiques (Server Actions).
- Logs de seguretat sense PII (adapter + `lib/logger`).
- RLS a nivell de base de dades.
- Secrets sempre via variables d'entorn (mai hardcode).

## Bones pràctiques

- No exposis claus en el codi ni en commits.
- Revisa sempre els permisos de Supabase i les polítiques RLS.
- Verifica fluxos de dades entre UI → Server Actions → Use Cases.
- Evita logs amb dades personals; usa `debug` només en dev.
- Redacta camps sensibles abans d'enviar errors a Sentry.

## Report d'incidències

Si detectes una vulnerabilitat, obre una incidència privada o contacta amb el mantenidor del projecte.
