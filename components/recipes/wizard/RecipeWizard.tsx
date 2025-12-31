'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepBasics } from './StepBasics';
import { StepIngredients } from './StepIngredients';
import { StepInstructions } from './StepInstructions';
import { StepReview } from './StepReview';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { createRecipeAction } from '@/app/actions/create-recipe'; // La teva action
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface WizardData {
  name: string;
  prepTimeMinutes: number;
  ingredients: { name: string; quantity: number; unit: string }[];
  steps: string[];
  dietaryTags: string[];
}

export function RecipeWizard({ userInventory }: { userInventory: InventoryItemProps[] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [data, setData] = useState<WizardData>({
    name: '',
    prepTimeMinutes: 20, // Valor inicial lògic
    ingredients: [],
    steps: [],
    dietaryTags: []
  });

  const next = () => setStep(s => Math.min(4, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  const handleFinish = async () => {
    setLoading(true);
    const result = await createRecipeAction(data);
    setLoading(false);

    if (result.success) {
        toast.success("✨ Recepta Publicada!");
        router.push(`/recipes/${result.recipeId}`);
    } else {
        toast.error(result.error);
    }
  };

  // Barra de Progrés
  const progress = (step / 4) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-900 rounded-full mb-8 overflow-hidden border border-slate-800">
        <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
            <StepBasics key="step1" data={data} update={setData} onNext={next} />
        )}
        {step === 2 && (
            <StepIngredients key="step2" data={data} update={setData} onNext={next} onBack={back} inventory={userInventory} />
        )}
        {step === 3 && (
            <StepInstructions key="step3" data={data} update={setData} onNext={next} onBack={back} />
        )}
        {step === 4 && (
            <StepReview key="step4" data={data} update={setData} onBack={back} onSubmit={handleFinish} loading={loading} />
        )}
      </AnimatePresence>
    </div>
  );
}