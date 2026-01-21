# Auditoria del projecte

Data: 2025-02-14

## Resum executiu

El projecte està alineat amb Clean Architecture i disposa d'una base sòlida de tests, però la documentació estava fragmentada i faltaven guies operatives bàsiques. Aquesta auditoria consolida l'estat actual i defineix accions prioritàries per mantenir coherència, seguretat i mantenibilitat.

## Estat actual

### Arquitectura i codi

- **Clean Architecture** aplicada amb separació clara entre `core/`, `adapters/`, `services/` i `app/`.
- **Use cases** al core i adapters per a Supabase i IA.
- **Dependències** actuals centrades en Next.js + Supabase + Zod.

### Testing

- Estructura de tests organitzada per capes (`tests/core`, `tests/usecases`, `tests/adapters`, etc.).
- Scripts de testing disponibles (`pnpm test`, `pnpm test:ci`).

### Documentació

- Guies de desenvolupament, contribució i seguretat actives.
- README per feature en `features/*/README.md`.
- Skills per agents a `docs/skills/`.

## Fortaleses

- Arquitectura neta i explícita.
- Bones pràctiques de validació i seguretat.
- Test suite organitzada per domini.
- Logs de servidor centralitzats amb `lib/logger` i sanejats de PII.
- Validació Zod ampliada per entrades d'IA (materialització de receptes).

## Riscos i deute tècnic

- **Dependència de documentació distribuïda:** sense una font de veritat única, es pot perdre coherència.
- **Variables d'entorn:** cal assegurar que les claus necessàries estiguin documentades i revisades periòdicament.
- **Evolució d'arquitectura:** sense revisar `guia.md` i `arquitectura_triatu.md`, la divergència pot créixer.
- **Observabilitat en marxa:** integració base de Sentry (client/server/edge) pendent d activar alertes i rutes crítiques.
- **Governança de prompts pendent:** LangSmith definit però pendent d'integració i flux de versions.

## Accions prioritàries (curt termini)

1) Revisar la documentació a cada canvi estructural.
2) Assegurar tests verds abans de cada PR.
3) Mantenir el fitxer `.env.local` alineat amb adapters i serveis actius.
4) Mantenir `README.md` per feature per facilitar onboarding.

## Accions recomanades (mig termini)

1) Revisió periòdica (trimestral) de seguretat i dependències.
2) Documentar fluxos de dades crítics (autenticació i decisions de grup).
3) Afegir un changelog si el ritme d'iteració augmenta.

