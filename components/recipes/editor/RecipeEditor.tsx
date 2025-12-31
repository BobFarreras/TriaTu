'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { createRecipeAction } from '@/app/actions/create-recipe';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Sparkles, Save } from 'lucide-react';
import { EditorData, InventoryItemUI } from './types';

interface Props {
  userInventory: InventoryItemUI[];
}

export function RecipeEditor({ userInventory }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<EditorData>({
    name: '',
    prepTimeMinutes: 30, // Un temps més estàndard per defecte
    ingredients: [],
    steps: [],
    dietaryTags: []
  });

  const handleSave = async () => {
    if (!data.name) return toast.error("Ei! Com es diu aquesta meravella?", { icon: '🤔' });
    if (data.ingredients.length === 0) return toast.error("La màgia necessita ingredients!", { icon: '🥕' });
    if (data.steps.length === 0) return toast.error("Explica'ns el secret (els passos)!", { icon: '📜' });

    setLoading(true);
    const result = await createRecipeAction(data); 
    setLoading(false);

    if (result.success) {
      toast.success("✨ Recepta Publicada!", { description: "Ja està disponible per a la comunitat." });
      router.push(`/recipes/${result.recipeId}`);
    } else {
      toast.error("Ups! Alguna cosa ha fallat", { description: result.error });
    }
  };

  return (
    <div className="relative flex flex-col gap-6 pb-24"> {/* pb-24 per donar espai al botó flotant en mòbil */}
      
      {/* 🎨 Decoració de Fons (Blobs) */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* 1. HERO CONTROL */}
      <MetaControls data={data} update={setData} />

      {/* 2. GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA ESQUERRA (Ingredients) */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
        >
           <IngredientsManager 
              data={data} 
              update={setData} 
              inventory={userInventory} 
           />
        </motion.div>

        {/* COLUMNA DRETA (Passos) */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
        >
           <StepsBuilder 
              data={data} 
              update={setData} 
           />
        </motion.div>
      </div>

      {/* 3. BOTÓ FLOTANT MÀGIC */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none"
      >
        <motion.button
          onClick={handleSave}
          disabled={loading}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(168, 85, 247, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white pl-8 pr-10 py-4 rounded-full font-black text-lg shadow-2xl flex items-center gap-3 transition-all disabled:opacity-70 disabled:grayscale ring-4 ring-slate-950"
        >
           {loading ? (
             <span className="animate-spin text-2xl">⏳</span>
           ) : (
             <Sparkles className="fill-white w-6 h-6 animate-pulse" />
           )}
           {loading ? 'CUINANT...' : 'PUBLICAR RECEPTA'}
        </motion.button>
      </motion.div>
    </div>
  );
}