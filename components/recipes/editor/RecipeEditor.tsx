'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { createRecipeAction } from '@/app/actions/create-recipe';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { EditorData, InventoryItemUI } from './types';

// ✅ IMPORTEM EL TEU HOOK
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  userInventory: InventoryItemUI[];
  // ❌ ESBORREM 'labels' d'aquí. Ja no ve del pare.
}

export function RecipeEditor({ userInventory }: Props) {
  const router = useRouter();
  
  // ✅ HOOK MÀGIC: Accedim a les traduccions directament
  const { t } = useLanguage();
  
  // Creem una drecera per no escriure t.create_recipe tot el rato
  const labels = t.create_recipe;

  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<EditorData>({
    name: '',
    prepTimeMinutes: 30,
    ingredients: [],
    steps: [],
    dietaryTags: []
  });

  const handleSave = async () => {
    // Ara labels ve del context, funciona igual!
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

  return (
    <div className="relative flex flex-col gap-6 pb-24"> 
      
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <MetaControls data={data} update={setData} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
        >
           {/* Passem només la part del diccionari que necessita el fill */}
           <IngredientsManager 
              data={data} 
              update={setData} 
              inventory={userInventory} 
              labels={labels.ingredients} 
           />
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
        >
           {/* Passem només la part del diccionari que necessita el fill */}
           <StepsBuilder 
              data={data} 
              update={setData} 
              labels={labels.steps} 
           />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50 bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none"
      >
        <motion.button
          onClick={handleSave}
          disabled={loading}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(168, 85, 247, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto bg-linear-to-r from-purple-600 to-pink-600 text-white pl-8 pr-10 py-4 rounded-full font-black text-lg shadow-2xl flex items-center gap-3 transition-all disabled:opacity-70 disabled:grayscale ring-4 ring-slate-950"
        >
           {loading ? (
             <span className="animate-spin text-2xl">⏳</span>
           ) : (
             <Sparkles className="fill-white w-6 h-6 animate-pulse" />
           )}
           {loading ? labels.editor.btn_cooking : labels.editor.btn_publish}
        </motion.button>
      </motion.div>
    </div>
  );
}