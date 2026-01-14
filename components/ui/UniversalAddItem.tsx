// ARXIU: src/components/ui/UniversalAddItem.tsx
'use client';

import { useState } from 'react';
import { FOOD_PRESETS } from '@/lib/food-presets'; // La teva llista de presets
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onAdd: (name: string, quantity: number, unit: string, emoji: string) => Promise<boolean>;
  placeholder?: string;
  defaultUnit?: string;
}

export function UniversalAddItem({ onAdd, placeholder = "Afegir ingredient...", defaultUnit = "ut" }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(defaultUnit);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof FOOD_PRESETS>([]);

  // Lògica d'autocomplete
  const handleNameChange = (val: string) => {
    setName(val);
    if (val.length > 1) {
      const matches = FOOD_PRESETS.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (preset: typeof FOOD_PRESETS[0]) => {
    setName(preset.name);
    setUnit(preset.defaultUnit);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    
    // Busquem l'emoji automàticament si tenim preset, sinó default
    const preset = FOOD_PRESETS.find(p => p.name.toLowerCase() === name.toLowerCase());
    const emoji = preset?.emoji || '📦';

    const success = await onAdd(name, quantity, unit, emoji);
    
    if (success) {
      setName("");
      setQuantity(1);
      setUnit(defaultUnit);
      setSuggestions([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="relative z-20">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-lg">
        
        {/* INPUT NOM + SUGGERIMENTS */}
        <div className="relative flex-1">
            <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-sm"
            />
            
            {/* Dropdown Suggeriments */}
            <AnimatePresence>
                {suggestions.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute top-10 left-0 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
                    >
                        {suggestions.map(s => (
                            <div 
                                key={s.name} 
                                onClick={() => selectSuggestion(s)}
                                className="px-4 py-2 hover:bg-slate-700 cursor-pointer flex items-center gap-2 text-sm text-slate-200"
                            >
                                <span>{s.emoji}</span>
                                <span>{s.name}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* QUANTITAT */}
        <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800">
            <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 bg-transparent border-none text-center text-white text-sm focus:ring-0 p-1"
            />
            <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="bg-transparent border-none text-slate-400 text-xs focus:ring-0 p-1 pr-6 cursor-pointer"
            >
                <option value="ut">ut</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
            </select>
        </div>

        {/* BOTÓ AFEGIR */}
        <button 
            type="submit" 
            disabled={isLoading || !name}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg p-2 transition-colors disabled:opacity-50"
        >
            {isLoading ? <span className="animate-spin text-xs">⏳</span> : <span>➕</span>}
        </button>
      </form>
    </div>
  );
}