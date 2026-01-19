import { ProductResult } from '@/app/actions/inventory';

interface Props {
  product: ProductResult;
  quantity: number;
  onSelect: (p: ProductResult) => void;
}

export function ProductCard({ product, quantity, onSelect }: Props) {

  // ✅ 1. LÒGICA DE NETEJA: Treiem la marca "Bonpreu" per guanyar espai
  // Això elimina "BONPREU ", "BON PREU ", "Bonpreu " del principi.
  const cleanName = product.name.replace(/^(BON\s?PREU)\s+/i, '');

  return (
    <button
      onClick={() => onSelect(product)}
      className={`
        relative flex flex-col w-full h-full
        bg-slate-900 border rounded-xl overflow-hidden transition-all text-left shadow-md active:scale-95
        ${quantity > 0
          ? 'border-emerald-500 ring-1 ring-emerald-500'
          : 'border-slate-800 hover:border-slate-600'}
      `}
    >
      {/* Comptador flotant */}
      {quantity > 0 && (
        <div className="absolute top-1 right-1 z-20 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
          {quantity}
        </div>
      )}

      {/* Imatge (Ajustada) */}
      <div className="aspect-square w-full bg-white p-2 flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt=""
            // 👇 AFEGEIX AQUESTA LÍNIA CLAU:
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-4xl">{product.emoji}</span>
        )}

        {/* Tag Source (Petit) */}
        <div className="absolute bottom-1 left-1 px-1 bg-slate-100 text-[8px] text-slate-500 rounded border border-slate-200">
          {product.source === 'BONPREU' ? 'BP' : 'DB'}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 w-full p-2 flex flex-col justify-between bg-slate-900 gap-1">

        {/* ✅ 2. NOM: 
            - Mòbil: text-[11px] (més llegible) i fins a 3 línies (line-clamp-3)
            - Desktop: text-sm (molt més gran) i leading normal
        */}
        <h4 className="text-[11px] leading-tight line-clamp-3 md:text-sm md:leading-snug font-medium text-slate-300">
          {cleanName}
        </h4>

        {/* Preu */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {/* ✅ 3. PREU: Més gran en desktop */}
          <span className="text-xs md:text-sm font-bold text-emerald-400">
            {product.price}€
          </span>

          {/* Botó + */}
          <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 md:w-6 md:h-6 md:text-sm">
            +
          </div>
        </div>
      </div>
    </button>
  );
}