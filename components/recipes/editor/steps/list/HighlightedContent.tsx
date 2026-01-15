'use client';

import { Ingredient } from '@/components/recipes/editor/types';
import { IngredientChip } from './IngredientChip';
// Importem el CountdownTimer (ha de ser accessible des d'aquí)
import { CountdownTimer } from '@/features/recipes/ui/components/CountdownTimer'; // Ajusta la ruta si cal

interface Props {
  content: string;
  ingredients: Ingredient[];
  interactive?: boolean; // ✅ Nou flag
}

export function HighlightedContent({ content, ingredients, interactive = false }: Props) {
  if (!content) return null;

  const parts = content.split(/(\[.*?\]|⏰\s*\d+\s*(?:min|minuts|minutes|s|segons)?)/g);

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-base text-slate-300">
      {parts.map((part, i) => {
        const key = `part-${i}-${part.substring(0, 5)}`;

        // CAS 1: TEMPS
        if (part.startsWith('⏰')) {
            // Si estem en mode interactiu (StepsPanel), posem el Timer real
            if (interactive) {
                const timeMatch = part.match(/(\d+)/);
                const minutes = timeMatch ? parseInt(timeMatch[0]) : 0;
                return <CountdownTimer key={key} minutes={minutes} />;
            }

            // Si estem a l'Editor, posem l'estil estàtic
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