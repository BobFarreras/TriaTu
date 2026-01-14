import { ProductResult } from '@/app/actions/inventory';
import { ProductCard } from './ProductCard';

interface Props {
  loading: boolean;
  results: ProductResult[];
  quantities: Record<string, number>;
  onSelect: (p: ProductResult) => void;
}

export function ProductGrid({ loading, results, quantities, onSelect }: Props) {
  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-56 bg-slate-800/50 rounded-xl border border-slate-800" />
        ))}
      </div>
    );
  }

  // 2. EMPTY STATE
  if (results.length === 0) {
    return (
      <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 opacity-60">
        <span className="text-6xl mb-4 grayscale opacity-50">🧺</span>
        <p className="text-base font-medium">No s'han trobat productes.</p>
        <p className="text-xs mt-1">Prova de buscar manualment.</p>
      </div>
    );
  }

  // 3. RESULTS GRID
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 pb-32">
      {results.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={quantities[product.id] || 0}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}