'use client';

import { useState } from 'react';

// ✅ 1. Definim la forma de les dades que la UI espera (View Model)
// Això elimina la necessitat de fer servir 'any'
interface EnrichedProductUI {
    id: string;
    name: string;
    price: string;
    image: string;
    emoji: string;
    tags: string[];
    // Nous camps
    isEco: boolean;
    isGlutenFree: boolean;
    isLactoseFree: boolean;
    isVegan: boolean;
    expiresInDays: number;
    expiryDate: string;
}

export default function BonpreuLabPage() {
    const [query, setQuery] = useState('');

    // ✅ 2. Ara usem la interfície aquí, adéu 'any'
    const [products, setProducts] = useState<EnrichedProductUI[]>([]);

    const [loading, setLoading] = useState(false);
    const [filterEco, setFilterEco] = useState(false);
    const [filterGluten, setFilterGluten] = useState(false);
    const [filterLactose, setFilterLactose] = useState(false);

    // Filtres combinats
    const displayedProducts = products.filter(p => {
        if (filterEco && !p.isEco) return false;
        if (filterGluten && !p.isGlutenFree) return false;
        if (filterLactose && !p.isLactoseFree) return false;
        return true;
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/experiments/bonpreu?q=${query}`);

            if (!res.ok) throw new Error("Error fetching data");

            const data = await res.json();

            // Assegurem que data.products existeix
            setProducts((data.products as EnrichedProductUI[]) || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen bg-zinc-950 text-zinc-100">
            <h1 className="text-3xl font-bold mb-6">🧪 Bonpreu Lab</h1>

            {/* CERCADOR */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busca: llet, formatge..."
                    className="flex-1 p-3 rounded bg-zinc-900 border border-zinc-700 placeholder-zinc-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-500 px-6 rounded font-bold transition-colors disabled:opacity-50"
                >
                    {loading ? 'Espiant...' : '🔎 Buscar'}
                </button>
            </form>

            {/* FILTRES */}
            {/* FILTRES */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <FilterButton active={filterEco} onClick={() => setFilterEco(!filterEco)} label="🌱 Eco" />
                <FilterButton active={filterGluten} onClick={() => setFilterGluten(!filterGluten)} label="🌾 Sense Gluten" />
                <FilterButton active={filterLactose} onClick={() => setFilterLactose(!filterLactose)} label="🥛 Sense Lactosa" />
            </div>

            {/* RESULTATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedProducts.map(p => (
                    <div key={p.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-4 hover:border-zinc-600 transition-colors">
                        {/* IMATGE */}
                        <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 p-1 relative overflow-hidden">
                            {/* Nota: Usem <img> normal per evitar configurar dominis a next.config.js per aquest experiment */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            <div className="absolute bottom-0 right-0 bg-black/60 px-1 text-xl backdrop-blur-sm rounded-tl-md">
                                {p.emoji}
                            </div>
                        </div>

                        {/* DADES */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-zinc-200 line-clamp-2 text-sm leading-snug" title={p.name}>{p.name}</h3>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xl font-bold text-emerald-400">{p.price}</span>
                                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
                                    Exp: {p.expiryDate}
                                </span>
                            </div>

                            {/* TAGS */}
                            <div className="mt-2 flex flex-wrap gap-1">
                                {p.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && displayedProducts.length === 0 && query && (
                <div className="text-center text-zinc-500 mt-10">
                    No s'han trobat productes o encara no has buscat.
                </div>
            )}
        </div>
    );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm border transition-colors ${
        active 
          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
      }`}
    >
      {label}
    </button>
  );
}