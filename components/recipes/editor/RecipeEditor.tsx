// src/components/recipes/editor/RecipeEditor.tsx
'use client'

import { useState } from 'react';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { createRecipeAction } from '@/app/actions/create-recipe';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Sparkles, ChefHat, ListChecks } from 'lucide-react';
// ✅ Importem StepsLabels per tipar correctament
import { EditorData, InventoryItemUI, StepsLabels } from './types'; 
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';

interface Props {
  userInventory: InventoryItemUI[];
}

export function RecipeEditor({ userInventory }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const labels = t.create_recipe;
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');

  const [data, setData] = useState<EditorData>({
    name: '',
    prepTimeMinutes: 30,
    ingredients: [],
    steps: [],
    dietaryTags: []
  });

  const handleSave = async () => {
    if (!data.name) return toast.error(labels.toasts.missing_name);
    if (data.ingredients.length === 0) return toast.error(labels.toasts.missing_ingredients);
    if (data.steps.length === 0) return toast.error(labels.toasts.missing_steps);

    setLoading(true);
    const result = await createRecipeAction(data); 
    setLoading(false);

    if (result.success) {
      toast.success(labels.toasts.success_title, { description: labels.toasts.success_desc });
      router.push(`/recipes/${result.recipeId}`);
    } else {
      toast.error(labels.toasts.error_title, { description: result.error });
    }
  };

  // ✅ SOLUCIÓ PROFESSIONAL (Sense 'any'):
  // 1. Tractem 'labels.steps' com un diccionari genèric de strings.
  //    Usem 'unknown' com a pas intermedi segur.
  const rawStepsLabels = labels.steps as unknown as Record<string, string>;

  // 2. Construïm l'objecte 'safeStepsLabels' assegurant que totes les propietats
  //    requerides per la interfície 'StepsLabels' tenen un valor (del JSON o per defecte).
  const safeStepsLabels: StepsLabels = {
    // Escampem totes les claus existents
    ...rawStepsLabels,
    // Assegurem les claus obligatòries amb valors per defecte (fallback)
    title: rawStepsLabels.title || "Passos",
    placeholder: rawStepsLabels.placeholder || "Ex: Tallar la ceba...",
    empty_state: rawStepsLabels.empty_state || "Afegeix el primer pas...",
    new_step_title: rawStepsLabels.new_step_title || "Nou Pas",
    new_step_desc: rawStepsLabels.new_step_desc || "Escriu i prem Enter",
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 relative"> 
      
      {/* 1. HEADER */}
      <MetaControls data={data} update={setData} />

      {/* 2. TABS */}
      <div className="shrink-0 px-4 py-2 bg-slate-950 border-b border-slate-900 z-40">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800/50 relative max-w-md mx-auto">
             <motion.div 
                layoutId="activeTab"
                className={`absolute inset-y-1 rounded-lg bg-slate-800 shadow-sm ${activeTab === 'ingredients' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+4px)] w-[calc(50%-8px)]'}`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
             />
             <button 
                onClick={() => setActiveTab('ingredients')}
                className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'ingredients' ? 'text-white' : 'text-slate-500'}`}
             >
                <ChefHat size={14} /> Ingredients 
                {data.ingredients.length > 0 && <span className="bg-purple-600 text-white text-[9px] px-1.5 rounded-full">{data.ingredients.length}</span>}
             </button>
             <button 
                onClick={() => setActiveTab('steps')}
                className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'steps' ? 'text-white' : 'text-slate-500'}`}
             >
                <ListChecks size={14} /> Passos
                {data.steps.length > 0 && <span className="bg-purple-600 text-white text-[9px] px-1.5 rounded-full">{data.steps.length}</span>}
             </button>
          </div>
      </div>

      {/* 3. ZONA DE CONTINGUT */}
      <div className="flex-1 overflow-hidden relative w-full p-2 sm:p-4 md:p-6">
        <div className="h-full w-full bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden relative backdrop-blur-sm">
            {activeTab === 'ingredients' ? (
               <IngredientsManager 
                  data={data} 
                  update={setData} 
                  inventory={userInventory} 
                  labels={labels.ingredients} 
               />
            ) : (
               <StepsBuilder 
                  data={data} 
                  update={setData} 
                  labels={safeStepsLabels} // ✅ Ara té el tipat perfecte
               />
            )}
        </div>
      </div>

      {/* 4. FAB 
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSave}
        disabled={loading}
        className="absolute bottom-6 right-6 z-50 w-16 h-16 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center ring-4 ring-slate-950/50 disabled:opacity-50 disabled:grayscale"
      >
         {loading ? <span className="animate-spin text-2xl">⏳</span> : <Sparkles className="w-7 h-7 fill-white animate-pulse" />}
      </motion.button>*/}
    </div>
  );
}