'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WizardData } from './RecipeWizard';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';

interface Props {
  data: WizardData;
  update: (d: WizardData) => void;
  onNext: () => void;
  onBack: () => void;
  inventory: InventoryItemProps[];
}

export function StepIngredients({ data, update, onNext, onBack, inventory }: Props) {
  const [tempName, setTempName] = useState('');
  const [tempQty, setTempQty] = useState('1');
  const [tempUnit, setTempUnit] = useState('ut');

  const addIngredient = (name: string, qty: number, unit: string) => {
    update({
      ...data,
      ingredients: [...data.ingredients, { name, quantity: qty, unit }]
    });
    setTempName(''); // Reset
  };

  const removeIngredient = (index: number) => {
    update({
      ...data,
      ingredients: data.ingredients.filter((_, i) => i !== index)
    });
  };

  return (
    <motion.div 
        initial={{ x: 20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
    >
      <div className="text-center">
        <span className="text-6xl animate-bounce inline-block">🥕</span>
        <h2 className="text-2xl font-bold mt-4">Què necessitem?</h2>
      </div>

      {/* INPUT MANUAL INTEL·LIGENT */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex gap-2 mb-2">
            <input 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Ex: Tomàquet..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && addIngredient(tempName, Number(tempQty), tempUnit)}
            />
        </div>
        <div className="flex gap-2">
            <input 
                type="number"
                value={tempQty}
                onChange={(e) => setTempQty(e.target.value)}
                className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-2 py-3 text-center text-white focus:border-purple-500 outline-none"
            />
            <select 
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-2 py-3 text-white focus:border-purple-500 outline-none"
            >
                <option value="ut">unitats</option>
                <option value="g">grams</option>
                <option value="ml">ml</option>
                <option value="cullerada">cullerada</option>
            </select>
            <button 
                onClick={() => addIngredient(tempName, Number(tempQty), tempUnit)}
                disabled={!tempName}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
            >
                <Plus />
            </button>
        </div>
      </div>

      {/* SUGGERIMENTS DE L'INVENTARI (Estil Xip) */}
      {inventory.length > 0 && (
          <div>
            <p className="text-xs uppercase font-bold text-slate-500 mb-2 flex items-center gap-1">
                <ShoppingBag size={12} /> Del teu rebost
            </p>
            <div className="flex flex-wrap gap-2">
                {inventory.slice(0, 8).map(item => (
                    <button
                        key={item.id}
                        onClick={() => addIngredient(item.name, 1, item.unit)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full transition-colors"
                    >
                        + {item.name}
                    </button>
                ))}
            </div>
          </div>
      )}

      {/* LLISTA D'INGREDIENTS AFEGITS */}
      <div className="space-y-2">
        {data.ingredients.map((ing, i) => (
            <motion.div 
                layout 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                key={i} 
                className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700"
            >
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                        {i + 1}
                    </span>
                    <div>
                        <p className="font-bold text-white">{ing.name}</p>
                        <p className="text-xs text-slate-400">{ing.quantity} {ing.unit}</p>
                    </div>
                </div>
                <button onClick={() => removeIngredient(i)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={18} />
                </button>
            </motion.div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onBack} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700">Enrere</button>
        <button 
            onClick={onNext} 
            disabled={data.ingredients.length === 0}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 disabled:opacity-50"
        >
            Següent
        </button>
      </div>
    </motion.div>
  );
}