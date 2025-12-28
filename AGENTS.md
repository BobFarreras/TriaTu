// AGENTS.md
# Governança del Projecte: Assistent de Decisions Quotidianes

Objectiu:
Aquest projecte prioritza simplicitat, mantenibilitat i claredat mental.

Regles generals:
- No afegir funcionalitat sense cas d'ús clar.
- No accedir directament a infraestructura des del domini.
- No usar estats globals no justificats (Zustand només per UI efímera).

Arquitectura:
- Clean Architecture obligatòria.
- Dependència: UI -> Application -> Domain <- Infrastructure.
- Use Cases independents del framework (Next.js).

Testing:
- TDD obligatori: Primer test, després codi.
- Cap PR sense tests verds.

UX:
- Una decisió = una resposta.
- Mai més de 2 interaccions per decisió.

Ètica:
- No manipular l'usuari.
- No fomentar dependència.