// =================== FILE: components/ui/Button.tsx ===================
// Botons "clicky" estil videojoc
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  
  // Base: Molt rodó, transició ràpida, efecte de prémer (active)
  const baseStyle = "px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-150 active:scale-95 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    // Verd Principal (Acció positiva)
    primary: "bg-green-500 text-white border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600",
    // Blau (Secundari / Informació)
    secondary: "bg-blue-400 text-white border-b-4 border-blue-600 hover:bg-blue-300 hover:border-blue-500",
    // Taronja (Atenció / Unir-se)
    accent: "bg-orange-400 text-white border-b-4 border-orange-600 hover:bg-orange-300 hover:border-orange-500",
    // Outline (Configuració / Tornar)
    outline: "bg-white text-gray-700 border-2 border-gray-200 border-b-4 hover:bg-gray-50 hover:border-gray-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "⏳..." : children}
    </button>
  );
}