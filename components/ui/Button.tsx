// =================== FILE: components/ui/Button.tsx ===================
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
  
  const baseStyle = "px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-150 active:scale-95 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    // Verd Principal
    primary: "bg-emerald-500 text-white border-b-4 border-emerald-700 hover:bg-emerald-400 hover:border-emerald-600 shadow-lg shadow-emerald-900/20",
    
    // Blau Secundari
    secondary: "bg-blue-500 text-white border-b-4 border-blue-700 hover:bg-blue-400 hover:border-blue-600 shadow-lg shadow-blue-900/20",
    
    // Taronja Accent
    accent: "bg-orange-500 text-white border-b-4 border-orange-700 hover:bg-orange-400 hover:border-orange-600 shadow-lg shadow-orange-900/20",
    
    // Outline (CORREGIT: SEMPRE FOSC)
    // Abans era blanc. Ara és transparent amb vores grises fosques i text blanc.
    outline: "bg-transparent text-gray-300 border-2 border-zinc-700 border-b-4 hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
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