'use client'


import { LucideIcon } from 'lucide-react';

type Option = {
  id: string;
  label: string;
  icon?: LucideIcon;
  emoji?: string;
};

interface SelectionGridProps {
  options: Option[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  multiSelect?: boolean;
}

export function SelectionGrid({ options, selectedValues, onChange, multiSelect = true }: SelectionGridProps) {
  
  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(v => v !== id));
    } else {
      if (multiSelect) {
        onChange([...selectedValues, id]);
      } else {
        onChange([id]);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        const Icon = option.icon;

        return (
          <button
            type="button"
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`
              flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
              ${isSelected 
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black scale-95 shadow-inner' 
                : 'border-gray-200 bg-white hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700'
              }
            `}
          >
            {Icon && <Icon size={24} />}
            {option.emoji && <span className="text-2xl">{option.emoji}</span>}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}