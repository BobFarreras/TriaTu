'use client';

import { Clock, Tag, Euro, User } from 'lucide-react';

interface Props {
  name: string;
  prepTime?: number;
  tags: string[];
  estimatedCost?: number; // ✅ Nou camp
  authorName?: string;    // ✅ Nou camp
}

export const getEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('pizza')) return '🍕';
  if (n.includes('pasta')) return '🍝';
  if (n.includes('burger')) return '🍔';
  if (n.includes('amanida')) return '🥗';
  if (n.includes('postre') || n.includes('pastís')) return '🍰';
  if (n.includes('arròs')) return '🥘';
  if (n.includes('peix')) return '🐟';
  if (n.includes('pollastre')) return '🍗';
  return '🍲';
};

export function RecipeHeader({ name, prepTime, tags, estimatedCost, authorName }: Props) {
  const emoji = getEmoji(name);

  return (
    <div className="relative mb-8">
      {/* Decoració de fons */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* EMOJI GEGANT */}
        <div className="text-7xl md:text-8xl drop-shadow-2xl animate-bounce-slow select-none grayscale-[0.2]">
          {emoji}
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
            {name}
          </h1>

          {/* META INFO */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. TEMPS */}
            {prepTime && (
              <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-full text-sm font-bold text-slate-300">
                <Clock size={14} className="text-purple-400" />
                {prepTime} min
              </span>
            )}

            {/* 2. PREU (Només si és > 0.50 per evitar soroll en receptes barates o manuals) */}
            {estimatedCost && estimatedCost > 0.5 && (
              <span className="flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-full text-sm font-bold text-emerald-400">
                <Euro size={14} />
                {estimatedCost.toFixed(2)}€
              </span>
            )}

            {/* 3. AUTOR */}
            {authorName && (
              <span className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-bold text-slate-400">
                <User size={12} />
                {authorName}
              </span>
            )}

            {/* 4. TAGS */}
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