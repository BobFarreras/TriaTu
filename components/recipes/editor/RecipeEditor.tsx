// src/components/recipes/editor/RecipeEditor.tsx
'use client'

import { useState } from 'react';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { createRecipeAction } from '@/app/actions/create-recipe';
import { toast } from 'sonner'; // Importem sonner per les notificacions
import { useRouter } from 'next/navigation';
import {  ChefHat, ListChecks, Save, AlertCircle } from 'lucide-react'; // Icona d'alerta
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

  // ✅ ESTAT D'ERRORS: Per pintar coses de vermell si falten
  const [errors, setErrors] = useState({
    name: false,
    ingredients: false,
    steps: false
  });

  const [data, setData] = useState<EditorData>({
    name: '',
    prepTimeMinutes: 30,
    ingredients: [],
    steps: [],
    dietaryTags: []
  });

  const handleSave = async () => {
    // 1. REINICIEM ERRORS
    setErrors({ name: false, ingredients: false, steps: false });
    let hasError = false;

    // 2. VALIDACIONS (Amb missatges específics i visuals)

    // A. Falta el Nom
    if (!data.name.trim()) {
      toast.error("Falta el Títol!", {
        description: "Posa-li un nom a la teva obra mestra 👨‍🍳",
        icon: <AlertCircle className="text-red-500" />
      });
      setErrors(prev => ({ ...prev, name: true }));
      hasError = true;
    }

    // B. Falten Ingredients
    else if (data.ingredients.length === 0) {
      toast.error("Falten Ingredients!", {
        description: "No es pot cuinar sense menjar! Afegeix-ne algun.",
        icon: <AlertCircle className="text-red-500" />
      });
      setErrors(prev => ({ ...prev, ingredients: true }));
      setActiveTab('ingredients'); // Portem l'usuari a la pestanya on falta info
      hasError = true;
    }

    // C. Falten Passos
    else if (data.steps.length === 0) {
      toast.error("Falten els Passos!", {
        description: "Explica'ns com es fa la recepta.",
        icon: <AlertCircle className="text-red-500" />
      });
      setErrors(prev => ({ ...prev, steps: true }));
      setActiveTab('steps'); // Portem l'usuari als passos
      hasError = true;
    }

    if (hasError) return; // Si hi ha errors, parem aquí.

    // 3. TOT CORRECTE -> GUARDEM
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

  // Cast segur per evitar errors de TS amb el JSON d'idiomes
  const rawStepsLabels = labels.steps as unknown as Record<string, string>;
  const safeStepsLabels: StepsLabels = {
    ...rawStepsLabels,
    title: rawStepsLabels.title || "Passos",
    placeholder: rawStepsLabels.placeholder || "Ex: Tallar la ceba...",
    empty_state: rawStepsLabels.empty_state || "Afegeix el primer pas...",
    new_step_title: rawStepsLabels.new_step_title || "Nou Pas",
    new_step_desc: rawStepsLabels.new_step_desc || "Escriu i prem Enter",
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">

      {/* 1. HEADER -> Li passem si hi ha error al nom */}
      <MetaControls
        data={data}
        update={setData}
        hasError={errors.name} // ✅ NOVA PROP
      />

      {/* 2. TABS -> Pintem de vermell si falta contingut */}
      <div className="shrink-0 px-4 py-2 bg-slate-950 border-b border-slate-900 z-40">
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800/50 relative max-w-md mx-auto">
          <motion.div
            layoutId="activeTab"
            className={`absolute inset-y-1 rounded-lg bg-slate-800 shadow-sm ${activeTab === 'ingredients' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+4px)] w-[calc(50%-8px)]'}`}
          />

          {/* Tab Ingredients */}
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 
                    ${errors.ingredients ? 'text-red-400 animate-pulse' : (activeTab === 'ingredients' ? 'text-white' : 'text-slate-500')}
                `}
          >
            <ChefHat size={14} />
            {errors.ingredients ? 'Falten Ingredients!' : 'Ingredients'}
            {data.ingredients.length > 0 && !errors.ingredients && <span className="bg-purple-600 text-white text-[9px] px-1.5 rounded-full">{data.ingredients.length}</span>}
          </button>

          {/* Tab Passos */}
          <button
            onClick={() => setActiveTab('steps')}
            className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 
                    ${errors.steps ? 'text-red-400 animate-pulse' : (activeTab === 'steps' ? 'text-white' : 'text-slate-500')}
                `}
          >
            <ListChecks size={14} />
            {errors.steps ? 'Falten Passos!' : 'Passos'}
            {data.steps.length > 0 && !errors.steps && <span className="bg-purple-600 text-white text-[9px] px-1.5 rounded-full">{data.steps.length}</span>}
          </button>
        </div>
      </div>

      {/* ... (ZONA DE CONTINGUT igual) ... */}
      <div className="flex-1 overflow-hidden relative w-full p-2 sm:p-4 md:p-6">
        <div className="h-full w-full bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden relative backdrop-blur-sm">
          {activeTab === 'ingredients' ? (
            <IngredientsManager data={data} update={setData} inventory={userInventory} labels={labels.ingredients} />
          ) : (
            <StepsBuilder data={data} update={setData} labels={safeStepsLabels} />
          )}
        </div>
      </div>

      {/* 4. FAB */}
      <div className="absolute bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          disabled={loading}
          className={`
            w-16 h-16 rounded-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] 
            flex items-center justify-center ring-4 transition-all
            ${loading
              ? 'bg-slate-800 cursor-wait ring-slate-700'
              : 'bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40 cursor-pointer ring-slate-950/80'
            }
          `}
        >
          {loading ? <span className="animate-spin text-2xl">⏳</span> : <Save className="w-7 h-7 text-white stroke-[2.5px]" />}
        </motion.button>
      </div>
    </div>
  );
}