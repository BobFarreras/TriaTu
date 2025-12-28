import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthInput({ label, className = '', ...props }: Props) {
  return (
    <div className="space-y-1 group">
      {/* LABEL: Sempre gris fosc, i blanc quan cliques (sense dark:) */}
      <label className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 group-focus-within:text-white transition-colors ml-2">
        {label}
      </label>
      
      <input 
        {...props}
        className={`
          w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl 
          
          /* BORDES I FONS: Sempre foscos (ignorem mode clar) */
          border-2 border-zinc-800 
          bg-black/40 
          text-white
          
          /* ESTATS: En fer focus, es posa negre total i vora blanca */
          focus:border-white focus:bg-black focus:scale-[1.01] focus:shadow-lg
          
          outline-none font-bold text-base md:text-lg transition-all duration-300
          
          /* PLACEHOLDER: Gris fosc subtil */
          placeholder:text-zinc-700
          
          ${className}
        `}
      />
    </div>
  );
}