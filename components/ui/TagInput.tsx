// =================== FILE: components/ui/TagInput.tsx ===================

'use client'

import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react'; // Assegura't de tenir lucide-react instal·lat

interface TagInputProps {
  label: string;
  name: string;
  defaultValue?: string[];
  placeholder?: string;
}

export function TagInput({ name, defaultValue = [], placeholder }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    // Evitem duplicats (case insensitive)
    if (trimmed && !tags.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      setTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      
      {/* INPUT AMB BOTÓ D'AFEGIR */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={placeholder}
                className="w-full pl-4 pr-4 py-4 rounded-2xl border-2 border-orange-200 dark:border-orange-800 bg-white dark:bg-black/40 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
        </div>
        <button
            type="button"
            onClick={addTag}
            disabled={!inputValue.trim()}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl px-4 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center"
        >
            <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* LLISTA DE TAGS (STICKERS) */}
      <div className="flex flex-wrap gap-3 min-h-12">
        {tags.length > 0 ? (
            tags.map((tag, idx) => (
            <span 
                key={idx} 
                className="animate-in zoom-in duration-200 group relative inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-100 font-black rounded-xl border-2 border-orange-200 dark:border-orange-700 select-none transform hover:scale-105 transition-transform"
            >
                {/* Text del tag */}
                <span className="text-sm uppercase tracking-wide">{tag}</span>
                
                {/* Botó d'eliminar */}
                <button 
                type="button" 
                onClick={() => removeTag(idx)}
                className="bg-white/50 hover:bg-white text-orange-700 rounded-full p-0.5 transition-colors"
                >
                <X size={14} strokeWidth={3} />
                </button>
            </span>
            ))
        ) : (
            <p className="text-sm text-gray-400 italic w-full text-center py-2 opacity-60">
                Encara no has afegit cap excepció extra.
            </p>
        )}
      </div>

      {/* Input ocult per al formulari */}
      <input type="hidden" name={name} value={tags.join(',')} />
    </div>
  );
}