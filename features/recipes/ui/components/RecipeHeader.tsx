'use client';

interface Props {
  name: string;
  prepTime?: number;
  tags: string[];
}

const getEmoji = (name: string) => {
    if (name.match(/pizz|hamburg|amanid|sopa|carn|peix|arròs/i)) return '🍲'; 
    return '🍽️';
};

export function RecipeHeader({ name, prepTime, tags }: Props) {
  return (
    // ✨ FIX: Menys padding (p-4), alçada reduïda
    <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between gap-4 rounded-t-3xl">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Emoji més petit */}
        <div className="shrink-0 text-2xl bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-slate-700">
            {getEmoji(name)}
        </div>
        <div className="min-w-0">
            {/* Títol més compacte */}
            <h1 className="text-lg md:text-xl font-black text-white leading-none truncate">{name}</h1>
            <div className="flex gap-1 mt-1 overflow-x-auto no-scrollbar">
                {tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] uppercase font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
      </div>

      {prepTime && (
        <div className="shrink-0 flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="text-sm">⏱️</span>
            <span className="font-mono font-bold text-purple-300 text-sm">{prepTime}m</span>
        </div>
      )}
    </div>
  );
}