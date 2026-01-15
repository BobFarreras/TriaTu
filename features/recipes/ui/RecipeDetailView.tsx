// src/features/recipes/ui/RecipeDetailView.tsx
'use client';

import { RecipeProps } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { RecipeHeader } from './components/RecipeHeader';
import { IngredientsPanel, IngredientWithMeta } from './components/IngredientsPanel'; 
import { StepsPanel } from './components/StepsPanel';
import { motion } from 'framer-motion';



interface ExtendedRecipeProps extends Omit<RecipeProps, 'ingredients'> {
    ingredients: IngredientWithMeta[]; // Utilitzem el tipus ric
    estimatedCost?: number;
    authorName?: string;
}

interface Props {
  recipe: RecipeProps;
  inventory: InventoryItemProps[];
  userId: string;
}

export function RecipeDetailView({ recipe, inventory, userId }: Props) {
  // Conversió segura a tipus estès per accedir a camps opcionals
  const extendedRecipe = recipe as unknown as ExtendedRecipeProps;

  return (
    <div className="flex flex-col gap-8">

      {/* 1. HERO HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <RecipeHeader
          name={recipe.name}
          prepTime={recipe.prepTimeMinutes}
          tags={recipe.tags}
          estimatedCost={extendedRecipe.estimatedCost || 0}
          authorName={extendedRecipe.authorName || "Xef Anònim"}
        />
      </motion.div>

      {/* 2. GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* COLUMNA ESQUERRA: INGREDIENTS */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 lg:sticky lg:top-8 z-9999"
        >
          <IngredientsPanel
            ingredients={extendedRecipe.ingredients}
            inventory={inventory}
            userId={userId}
          />
        </motion.div>

        {/* COLUMNA DRETA: PASSOS */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-8"
        >
          <StepsPanel
            steps={recipe.steps}
            // Fem un cast segur a StepIngredient[] que és compatible
            ingredients={extendedRecipe.ingredients}
          />
        </motion.div>

      </div>
    </div>
  );
}