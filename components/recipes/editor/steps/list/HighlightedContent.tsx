'use client';

import { Ingredient } from '../../types';
import { IngredientChip } from './IngredientChip';

interface Props {
  content: string;
  ingredients: Ingredient[];
}

export function HighlightedContent({ content, ingredients }: Props) {
  if (!content) return null;

  // Regex: Captura [Nom] o ⏰ X min
  const parts = content.split(/(\[.*?\]|⏰\s*\d+\s?min)/g);

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-sm pointer-events-none select-none text-slate-300">
      {parts.map((part, i) => {
        // Clau única per evitar errors de React
        const key = `part-${i}-${part.substring(0, 5)}`;

        // CAS 1: TEMPS
        if (part.startsWith('⏰')) {
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-md text-xs font-bold mx-1 border border-purple-500/20 align-baseline shadow-sm"
            >
              {part}
            </span>
          );
        }

        // CAS 2: INGREDIENT [Nom]
        if (part.startsWith('[') && part.endsWith(']')) {
          const cleanName = part.slice(1, -1);
          
          // 🔍 BUSQUEM L'INGREDIENT REAL A LA LLISTA
          // Això és el que connecta el text amb la imatge del Dock
          const ingredientData = ingredients.find((ing) => ing.name === cleanName);

          // Si no trobem l'ingredient (potser l'usuari l'ha esborrat del dock però segueix al text),
          // igualment renderitzem el xip però sense dades extres.
          return (
            <IngredientChip 
                key={key} 
                name={cleanName} 
                ingredient={ingredientData} 
            />
          );
        }

        // CAS 3: Text normal
        return <span key={key}>{part}</span>;
      })}
    </p>
  );
}