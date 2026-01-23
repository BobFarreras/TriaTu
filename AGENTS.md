// AGENTS.md
# Governança del Projecte: Assistent de Decisions Quotidianes

Objectiu:
Aquest projecte prioritza simplicitat, mantenibilitat i claredat mental.

Regles generals:
- No afegir funcionalitat sense cas d'ús clar.
- No accedir directament a infraestructura des del domini.
- No usar estats globals no justificats (Zustand només per UI efímera).
- Validar inputs amb Zod abans de tocar infraestructura.
- Evitar logs amb PII; usa `lib/logger` i `debug` nomes en dev.

Arquitectura:
- Clean Architecture obligatòria.
- Dependència: UI -> Application -> Domain <- Infrastructure.
- Use Cases independents del framework (Next.js).

Testing:
- TDD obligatori: Primer test, després codi.
- Cap PR sense tests verds.

Documentació:
- Qualsevol canvi d'arquitectura o flux ha d'actualitzar `guia.md` i `arquitectura_triatu.md`.
- Les guies operatives viuen a `docs/` i s'han de mantenir coherents.
- Registra deute tècnic o riscos nous a `docs/PROJECT_AUDIT.md`.

UX:
- Una decisió = una resposta.
- Mai més de 2 interaccions per decisió.

Ètica:
- No manipular l'usuari.
- No fomentar dependència.

