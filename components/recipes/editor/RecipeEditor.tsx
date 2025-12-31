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
import { EditorData, InventoryItemUI } from './types'; // ✅ IMPORTS TIPATS

interface Props {
  userInventory: InventoryItemUI[]; // ✅ ADÉU ANY
}

export function RecipeEditor({ userInventory }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<EditorData>({
    name: '',
    prepTimeMinutes: 20,
    ingredients: [],
    steps: [],
    dietaryTags: []
  });

  const handleSave = async () => {
    // ... validacions iguals ...
    if (!data.name) return toast.error("La recepta necessita un nom!");
    if (data.ingredients.length === 0) return toast.error("No pots cuinar sense ingredients!");
    if (data.steps.length === 0) return toast.error("Explica com es fa!");

    setLoading(true);
    // TypeScript ara sap que 'data' compleix la interfície
    const result = await createRecipeAction(data); 
    setLoading(false);

    if (result.success) {
      toast.success("✨ Recepta creada amb èxit!");
      router.push(`/recipes/${result.recipeId}`);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <MetaControls data={data} update={setData} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-6">
           <IngredientsManager 
              data={data} 
              update={setData} 
              inventory={userInventory} 
           />
        </div>

        <div className="lg:col-span-7 space-y-6">
           <StepsBuilder 
              data={data} 
              update={setData} 
           />
        </div>
      </div>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none"
      >
        <button
          onClick={handleSave}
          disabled={loading}
          className="pointer-events-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-black text-lg shadow-2xl shadow-purple-900/50 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:grayscale"
        >
           {loading ? <span className="animate-spin">⏳</span> : <Sparkles className="fill-white" />}
           PUBLICAR RECEPTA
        </button>
      </motion.div>
    </div>
  );
}