'use client';

import { Ingredient } from '@/components/recipes/editor/types';
import { IngredientChip } from './IngredientChip';
import { CountdownTimer } from '@/features/recipes/ui/components/CountdownTimer';

interface Props {
  content: string; // TypeScript diu string, però pot arribar null en runtime
  ingredients: Ingredient[];
  interactive?: boolean;
}

export function HighlightedContent({ content, ingredients, interactive = false }: Props) {
  // ✅ 1. PROTECCIÓ ROBUSTA: Si no hi ha contingut o no és string, retornem null
  if (!content || typeof content !== 'string') return null;

  // Ara és segur fer .split()
  const parts = content.split(/(\[.*?\]|⏰\s*\d+\s*(?:min|minuts|minutes|s|segons)?)/g);

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-base text-slate-300">
      {parts.map((part, i) => {
        const key = `part-${i}-${part.substring(0, 5)}`;

        // CAS 1: TEMPS
        if (part.startsWith('⏰')) {
            if (interactive) {
                const timeMatch = part.match(/(\d+)/);
                const minutes = timeMatch ? parseInt(timeMatch[0]) : 0;
                return <CountdownTimer key={key} minutes={minutes} />;
            }
            return (
                <span key={key} className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-md text-xs font-bold mx-1 border border-purple-500/20 align-baseline shadow-sm">
                {part}
                </span>
            );
        }

        // CAS 2: INGREDIENT [Nom]
        if (part.startsWith('[') && part.endsWith(']')) {
          const cleanName = part.slice(1, -1);
          // Busquem l'ingredient complet a la llista per tenir imatge/preu
          const ingredientData = ingredients.find((ing) => ing.name === cleanName);

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