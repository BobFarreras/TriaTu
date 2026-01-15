# Seguretat

## Principis

- Validació estricta d'inputs (Zod).
- Rate limiting per protegir endpoints i IA.
- Logs d'auditoria per accions sensibles.
- RLS a nivell de base de dades.

## Bones pràctiques

- No exposis claus en el codi ni en commits.
- Revisa sempre els permisos de Supabase.
- Verifica fluxos de dades que viatgen entre UI → Server Actions → Use Cases.

## Report d'incidències

Si detectes una vulnerabilitat, obre una incidència privada o contacta amb el mantenidor del projecte.
