'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, ChefHat, Clock, Euro, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { materializeRecipeAction } from '@/app/actions/recipe-actions';
import { HistoryItem, safeParseMeta } from '../../logic/history-types';
import { MagicStats } from './MagicStats'; // ✅ Ara ja existeix

// Interfície mínima per a la recepta completa (evita 'any')
interface RecipeSummary {
    prepTimeMinutes?: number;
    estimatedCost?: number;
    ingredients?: unknown[];
}

export const HistoryDetails = ({ item }: { item: HistoryItem }) => {
  const { t } = useLanguage(); 
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const meta = safeParseMeta(item.metadata);
  
  // Casting segur a la interfície mínima
  const fullRecipe = meta.fullRecipe as RecipeSummary | undefined;
  
  const isRecipe = !!fullRecipe || !!meta.recipeId;
  const isMagic = meta.isAiGenerated || (typeof meta.matchPercentage === 'number') || meta.isSafe;

  const handleViewRecipe = () => {
    if (meta.recipeId) {
        router.push(`/recipes/${meta.recipeId}`);
        return;
    }
    if (meta.fullRecipe) {
        startTransition(async () => {
            const res = await materializeRecipeAction(meta.fullRecipe);
            if (res.success && res.recipeId) {
                router.push(`/recipes/${res.recipeId}`);
            } else {
                // ✅ Accés segur a l'error (ActionResponse pot tenir error opcional)
                alert("Error: " + (res.error || "Unknown error"));
            }
        });
    }
  };

  const getDynamicReason = () => {
    if (meta.isManual) return t.room.history.manual_reason;
    if (meta.isSafe || (meta.matchCount === 0)) return t.room.history.magic_safe;
    if (typeof meta.matchCount === 'number' && meta.matchCount > 0) {
      return t.room.history.magic_match.replace('{count}', meta.matchCount.toString());
    }
    return item.reason;
  };

  return (
    <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-800/50 mb-4">
         <div className="flex gap-3 text-zinc-300">
            <BrainCircuit size={20} className="text-purple-400 shrink-0 mt-0.5" />
            <p className="italic text-sm leading-relaxed text-zinc-300">"{getDynamicReason()}"</p>
         </div>
      </div>

      {fullRecipe && (
        <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-zinc-800/40 p-2 rounded-xl text-center border border-white/5">
                <Clock size={14} className="mx-auto mb-1 text-zinc-400" />
                <span className="text-xs font-bold text-white">{fullRecipe.prepTimeMinutes || 30} min</span>
            </div>
            <div className="bg-zinc-800/40 p-2 rounded-xl text-center border border-white/5">
                <Euro size={14} className="mx-auto mb-1 text-zinc-400" />
                <span className="text-xs font-bold text-white">
                    {fullRecipe.estimatedCost ? `~${fullRecipe.estimatedCost.toFixed(2)}€` : '-'}
                </span>
            </div>
            <div className="bg-zinc-800/40 p-2 rounded-xl text-center border border-white/5">
                <ChefHat size={14} className="mx-auto mb-1 text-zinc-400" />
                <span className="text-xs font-bold text-white">
                    {Array.isArray(fullRecipe.ingredients) ? fullRecipe.ingredients.length : 0} ings
                </span>
            </div>
        </div>
      )}

      {isMagic && <MagicStats metadata={item.metadata} />}

      {isRecipe && (
        <Button onClick={handleViewRecipe} disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20">
            {isPending ? <Loader2 className="animate-spin" /> : <ChefHat size={20} />}
            <span className="text-sm">{meta.recipeId ? t.room.history.view_recipe : "Guardar i Veure Recepta"}</span>
        </Button>
      )}
    </div>
  );
};
