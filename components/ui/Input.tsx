// =================== FILE: components/ui/Input.tsx ===================
// Nota: Si tens aquest component en un fitxer separat, posa-ho allà.
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* LABEL: Sempre gris clar */}
      {label && <label className="text-sm font-bold text-gray-400 uppercase tracking-wide ml-1">{label}</label>}
      
      <input 
        className={`
          px-4 py-3 rounded-xl 
          /* ESTILS BASE FOSCOS */
          border-2 border-zinc-700 
          bg-black/30 
          text-white 
          placeholder:text-zinc-600
          
          /* ESTATS FOCUS */
          focus:ring-2 focus:ring-white/20 focus:border-white focus:bg-black/50
          focus:outline-none 
          transition-all duration-200
          
          ${className}
        `}
        {...props}
      />
    </div>
  );
}