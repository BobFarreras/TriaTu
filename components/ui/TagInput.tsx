'use client'

import { useState, KeyboardEvent } from 'react';
import { Input } from './Input';

interface TagInputProps {
  label: string;
  name: string; // El nom per al input hidden (perquè funcioni amb Server Actions)
  defaultValue?: string[];
  placeholder?: string;
}

export function TagInput({ label, name, defaultValue = [], placeholder }: TagInputProps) {
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
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {/* Input visible per escriure */}
      <Input
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag} // Afegir en perdre el focus
      />

      {/* Llista visual de tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded text-sm flex items-center gap-1">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(idx)}
              className="text-gray-500 hover:text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input ocult real que s'envia al servidor */}
      <input type="hidden" name={name} value={tags.join(',')} />
    </div>
  );
}