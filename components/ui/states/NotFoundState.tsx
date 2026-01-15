// src/components/ui/states/NotFoundState.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  icon?: string; // Emoji o icona
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function NotFoundState({ 
  icon = "🤔", 
  title, 
  description, 
  actionHref = "/dashboard", 
  actionLabel = "Tornar a l'inici" 
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center text-slate-200">
      <div className="max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Icona Gran */}
        <div className="text-8xl filter drop-shadow-2xl mb-4">
          {icon}
        </div>
        
        {/* Textos */}
        <div className="space-y-2">
            <h2 className="text-3xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
            {description}
            </p>
        </div>

        {/* Botó d'Acció */}
        <div className="pt-6">
          <Link 
            href={actionHref} 
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-bold text-slate-950 bg-white rounded-xl hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/10"
          >
            <ArrowLeft size={18} />
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}