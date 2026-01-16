import { FOOD_PRESETS } from "./index";
// Assumeixo que FoodPreset té una forma similar a { id: string, name: string, emoji: string, ... }
// Si els camps tenen altres noms, ajusta-ho aquí (ex: label en comptes de name).

/**
 * Normalitza un text per fer comparacions robustes
 * Treu accents, passa a minúscules i elimina espais sobrants.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Treu accents
    .trim();
}

/**
 * Busca l'emoji més adequat basant-se en el nom de l'ingredient
 * utilitzant la base de dades existent de FOOD_PRESETS.
 */
export function getIngredientEmoji(ingredientName: string): string {
  if (!ingredientName) return '🥘';

  const normalizedInput = normalizeText(ingredientName);

  // 1. Cerca Exacta o Parcial ("Pollastre" -> troba el preset "Pollastre")
  // Prioritzem els presets que tinguin un nom que estigui contingut en l'ingredient o viceversa.
  const found = FOOD_PRESETS.find(preset => {
    // Suposem que el preset té un camp 'name' o 'id' que és el nom de l'aliment
    // Ajusta 'preset.id' o 'preset.name' segons la teva interfície FoodPreset
    const presetName = normalizeText(preset.id); 
    
    // Cas A: L'ingredient és "Pit de pollastre" i el preset és "pollastre" -> MATCH
    if (normalizedInput.includes(presetName)) return true;
    
    // Cas B: L'ingredient és "pollastre" i el preset és "pollastre rostit" -> MATCH (més feble, però vàlid)
    if (presetName.includes(normalizedInput)) return true;

    return false;
  });

  if (found) {
    // Retornem l'emoji del preset trobat
    return found.emoji || '🥘'; 
  }

  // 2. Fallbacks per defecte si no trobem res a la teva llista
  // Això només s'executa si l'ingredient no està a la teva DB de presets.
  if (normalizedInput.includes('oli')) return '🫒';
  if (normalizedInput.includes('sal')) return '🧂';
  if (normalizedInput.includes('sucre')) return '🍬';
  
  return '🥘';
}

/**
 * Determina l'emoji principal d'una recepta
 */
export function getMainRecipeEmoji(recipeName: string, tags: string[] = []): string {
    // Intentem trobar si el nom de la recepta conté un ingredient principal
    const ingredientEmoji = getIngredientEmoji(recipeName);
    
    // Si hem trobat un emoji específic (que no és el per defecte), l'usem
    if (ingredientEmoji !== '🥘') return ingredientEmoji;

    // Si no, usem els tags per deduir la categoria
    if (tags.some(t => normalizeText(t).includes('postr'))) return '🍰';
    if (tags.some(t => normalizeText(t).includes('vega'))) return '🌱';
    if (tags.some(t => normalizeText(t).includes('beguda'))) return '🍹';

    return '🍲';
}