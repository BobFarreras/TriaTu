// =================== FILE: components/ui/AuthInput.tsx ===================
import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthInput({ label, className = '', ...props }: Props) {
  return (
    <div className="space-y-1 group">
      <label className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors ml-2">
        {label}
      </label>
      <input 
        {...props}
        className={`
          w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl 
          border-2 border-gray-100 dark:border-zinc-800 
          bg-gray-50 dark:bg-black/40 
          focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-black focus:scale-[1.01] focus:shadow-lg
          outline-none font-bold text-base md:text-lg transition-all duration-300
          placeholder:text-gray-300 dark:placeholder:text-zinc-700
          ${className}
        `}
      />
    </div>
  );
}