'use client';

import { FOOD_TAXONOMY, MainCategory } from '@/lib/food-categories';

interface Props {
  onSelect: (cat: MainCategory) => void;
}

export function CategoryGrid({ onSelect }: Props) {
  return (
    <div className="p-2 pb-32">
       {/* HEADER DIVERTIT */}
       <div className="mb-6 text-center animate-in slide-in-from-top-4 fade-in duration-700">
          <h2 className="text-3xl font-black text-white mb-1">Què afegim? 😋</h2>
          <p className="text-slate-400 text-sm">Tria una secció per començar</p>
       </div>

       {/* GRID DE CATEGORIES (Masonry like) */}
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FOOD_TAXONOMY.map((cat, index) => (
             <button
                key={cat.id}
                onClick={() => onSelect(cat)}
                // Animació escalonada (staggered) usant 'style' per l'index
                style={{ animationDelay: `${index * 50}ms` }}
                className={`
                   relative h-32 md:h-40 rounded-3xl overflow-hidden border border-white/5 
                   flex flex-col items-center justify-center gap-2
                   bg-gradient-to-br ${cat.gradient}
                   hover:scale-[1.02] active:scale-95 transition-all duration-300
                   shadow-lg hover:shadow-xl group
                   animate-in zoom-in-50 fill-mode-backwards
                `}
             >
                {/* Brillo de fons */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors" />
                
                {/* Emoji Gegant */}
                <span className="text-5xl md:text-6xl filter drop-shadow-lg transform group-hover:-rotate-12 transition-transform duration-300">
                   {cat.emoji}
                </span>
                
                {/* Etiqueta */}
                <span className="font-bold text-white text-sm tracking-wide drop-shadow-md relative z-10">
                   {cat.label}
                </span>

                {/* Decoració de fons (cercles) */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
             </button>
          ))}
       </div>
       
       {/* Espai extra per no tapar amb el dock */}
       <div className="h-24" /> 
    </div>
  );
}