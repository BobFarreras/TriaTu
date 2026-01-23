# ProductSearchFilter

## Objectiu

Unificar i reforcar el filtratge de productes del cataleg (Bonpreu) per evitar falsos positius.
El servei s usa tant a l'inventari com al linkador d'ingredients de receptes.

## Per que

- Evitar casos com "sabor llima" dins la seccio de fruita (fals positiu).
- Garantir consistencia entre diferents pantalles (inventari, receptes).
- Centralitzar heuristiques per facilitar manteniment i tests de regressio.

## On s utilitza

- `features/inventory/products/useProductSearch.ts`
- `features/recipes/components/editor/ingredients/useProductLinker.ts`
- `lib/taxonamy/*.ts` (definicio de queries per seccio i subcategoria)

## Com funciona

1) Normalitza text (accents, minuscules).
2) Tokenitza per paraules i elimina stopwords i mesures (ex: `500g`, `1l`).
3) Normalitza plurals bàsics (singular/plural) per millorar coincidències exactes.
4) Manté tokens curts clau (ex: `pa`, `ou`, `vi`, `te`) i els tracta com a àncores per evitar falsos positius.
5) Aplica:
   - `exclude`: paraules prohibides (coincidencia per paraula).
   - `mustContain`: ha de contenir almenys una paraula requerida.
   - `queryTerms`: ratio de coincidencia per queries multi paraula.
   - `fuzzy`: tolera variants tipogràfiques i dialectals (ex: "tomata" vs "tomàquet") sense llistes manuals, evitant diminutius si no es demanen.
6) `avoidFlavorMatches`: descarta coincidencies que nomes apareixen en context de "sabor/gust/aroma".
7) `categoryId`: aplica un bloqueig extra segons seccio (ex: verdura no pot retornar neteja o carn).
8) `contextEmoji`: fa servir FOOD_PRESETS per afegir termes del mateix emoji com a fallback (sense hardcodejar sinonims per producte).

## Notes de taxonomia

- Les subcategories poden tenir `query` com a string o array per cobrir variants i noms comercials.
- Els termes de cerca han de tenir com a mínim 3 caràcters per passar el guard de l'API.
- Rebost: les queries s'han ampliat a `lib/taxonamy/pantry.ts` per cobrir variants comercials.
- Pa: la subcategoria exigeix `pa/pan` (mustContain) i exclou cereals/galetes per reduir falsos positius.
- Quan una subcategoria no retorna resultats, es crea un item manual amb emoji per poder afegir-lo igualment a l'inventari.

## Opcions

- `exclude?: string[]`
- `mustContain?: string | string[]`
- `queryTerms?: string[]`
- `minMatchRatio?: number` (default 0.5)
- `minMatchCount?: number` (default 1)
- `avoidFlavorMatches?: boolean`
- `categoryId?: string` (ex: `vegetables`, `fruit`)
- `contextEmoji?: string` (emoji seleccionat per fer fallback amb presets)

## Regles de categoria

Ara mateix s aplica bloqueig per:
- `vegetables` i `fruit`: exclou neteja, carn, peix i embotits.
- `meat`: exclou neteja i peix.
- `fish`: exclou neteja, carn i embotits.
- `household`: sense bloqueig extra.

Les llistes es poden ajustar a `core/application/services/ProductSearchFilter.ts`.

## Exemple

Query: "Llimona"
Resultat:
- S accepta "Llimona natural"
- Es descarta "Patates fregides sabor llima"

Query: "Cuixes"
Resultat:
- S accepta "Cuixa de pollastre"
- S evita "Cuixeta de cranc" si la categoria es carn

Query: "Pa barra"
Resultat:
- S accepta "Pa integral"
- S evita "Barra de cereals"

Query: "Maionesa" (subcategoria salses)
Resultat:
- S accepta "Mayonesa Sispalu"

Query: "Tomàquet" (emoji 🍅)
Resultat:
- S accepta "Tomata pebrot" per fuzzy i fallback d emoji

## Tests

- `tests/services/ProductSearchFilter.test.ts`
- `tests/services/ProductSearchFilter.integration.test.ts`
- `tests/features/ProductFallback.test.ts`
