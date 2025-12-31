'use client';

import { Clock, Tag } from 'lucide-react';

interface Props {
  name: string;
  prepTime?: number;
  tags: string[];
}

const getEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('pizza')) return '🍕';
    if (n.includes('pasta')) return '🍝';
    if (n.includes('burger')) return '🍔';
    if (n.includes('amanida')) return '🥗';
    if (n.includes('postre')) return '🍰';
    if (n.includes('arròs')) return '🥘';
    return '🍲';
};

export function RecipeHeader({ name, prepTime, tags }: Props) {
  const emoji = getEmoji(name);

  return (
    <div className="relative">
      {/* Decoració de fons */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
         {/* EMOJI GEGANT */}
         <div className="text-7xl md:text-8xl drop-shadow-2xl animate-bounce-slow">
            {emoji}
         </div>

         <div className="flex-1 space-y-3">
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3">
                {prepTime && (
                    <span className="flex items-center gap-1.5 bg-slate-900/50 border border-slate-700 px-3 py-1.5 rounded-full text-sm font-bold text-slate-300">
                        <Clock size={14} className="text-purple-400" />
                        {prepTime} min
                    </span>
                )}
                
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-purple-900/20 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-purple-300 uppercase tracking-wide">
                        <Tag size={10} /> {tag}
                    </span>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
}