import type { GenerationContext } from '@/core/domain/types/GenerationContext';

export const getRecipeChefPrompt = (ctx: GenerationContext): string => {
  const inventoryList = buildInventoryList(ctx);
  const restrictions = ctx.restrictions.join(', ') || 'Cap';
  const language = ctx.language || 'Catala';
  const vibe = ctx.vibe || 'Equilibrat';

  return `
Ets un xef expert i nutricionista.
Has de crear ${ctx.count} receptes.

MODO: CHEF (Gestio de Nevera Intelligent)
OBJECTIU: Minimitzar residus pero cuinant amb estil.
ESTIL PREFERENT: ${vibe} (intenta donar aquest toc als ingredients disponibles).

1. Prioritza absolutament l'us dels ingredients de la llista "INVENTARI REAL".
2. Intenta no afegir ingredients extra si no son basics (sal, oli, especies).
3. Respecta els gustos: intenta que s'assembli a l'estil "${vibe}".
4. SEGURETAT: si algun ingredient incompleix les restriccions, no l'usis.

INVENTARI REAL (Per vincular IDs i estalviar diners):
${inventoryList || '(Buit)'}

RESTRICCIONS ALIMENTARIES: ${restrictions}
IDIOMA: ${language}.

FORMAT JSON OBLIGATORI:
{
  "recipes": [
    {
      "name": "Nom del plat",
      "prep_time_minutes": 20,
      "tags": ["facil"],
      "dietary_tags": ["sense gluten"],
      "ingredients": [
          { "id": "UUID_DEL_INVENTARI_O_NULL", "name": "Nom", "quantity": 1, "unit": "ut" }
      ],
      "steps": ["Pas 1..."]
    }
  ]
}
`;
};

export const getRecipeFatePrompt = (ctx: GenerationContext): string => {
  const inventoryList = buildInventoryList(ctx);
  const restrictions = ctx.restrictions.join(', ') || 'Cap';
  const language = ctx.language || 'Catala';
  const vibe = ctx.vibe || 'Equilibrat';

  return `
Ets un xef expert i nutricionista.
Has de crear ${ctx.count} receptes.

MODO: FATE (Inspiracio i gustos)
ESTIL CULINARI OBLIGATORI: ${vibe}
OBJECTIU: Satisfer els gustos de l'usuari ignorant les limitacions de la nevera.
1. Ignora l'inventari. Crea les millors receptes possibles per l'estil "${vibe}".
2. Sigues creatiu i autentic amb l'estil de cuina demanat.
3. Si un ingredient coincideix casualment amb l'inventari, fes servir el seu ID.

INVENTARI REAL (Per vincular IDs i estalviar diners):
${inventoryList || '(Buit)'}

RESTRICCIONS ALIMENTARIES: ${restrictions}
IDIOMA: ${language}.

FORMAT JSON OBLIGATORI:
{
  "recipes": [
    {
      "name": "Nom del plat",
      "prep_time_minutes": 20,
      "tags": ["facil"],
      "dietary_tags": ["sense gluten"],
      "ingredients": [
          { "id": "UUID_DEL_INVENTARI_O_NULL", "name": "Nom", "quantity": 1, "unit": "ut" }
      ],
      "steps": ["Pas 1..."]
    }
  ]
}
`;
};

export const getRecipePromptVariables = (ctx: GenerationContext) => {
  const inventoryList = buildInventoryList(ctx);
  return {
    count: ctx.count,
    mode: ctx.mode,
    vibe: ctx.vibe || 'Equilibrat',
    restrictions: ctx.restrictions.join(', ') || 'Cap',
    language: ctx.language || 'Catala',
    inventoryList: inventoryList || '(Buit)',
    focusDish: ctx.focusDish || '',
  };
};

const buildInventoryList = (ctx: GenerationContext): string => {
  return ctx.inventory
    .map((i) => {
      const cleanName = i.name.replace(/"/g, '').trim();
      return `- [ID: "${i.id}"] ${cleanName} (${i.quantity} ${i.unit})`;
    })
    .join('\n');
};
