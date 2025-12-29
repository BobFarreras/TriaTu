import { ScannedItem } from "@/core/domain/types/ScannedItem";

interface AROverlayProps {
  imageSrc: string; 
  items: ScannedItem[];
  onItemClick?: (index: number) => void;
}

export function AROverlay({ imageSrc, items, onItemClick }: AROverlayProps) {
  return (
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-slate-700 shadow-2xl group">
      
      {/* 1. LA IMATGE CONGELADA */}
      <img 
        src={imageSrc} 
        alt="Captured" 
        className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity duration-500" 
      />

      {/* ✅ Fix CSS: gradient-to-t */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* 2. ELS QUADRATS (AR BOXES) */}
      {items.map((item, idx) => {
        if (!item.box2d) return null;

        // Gemini retorna [ymin, xmin, ymax, xmax] en escala 0-1000
        const [ymin, xmin, ymax, xmax] = item.box2d;
        
        // Convertim a percentatges
        const top = ymin / 10;    
        const left = xmin / 10;
        const height = (ymax - ymin) / 10;
        const width = (xmax - xmin) / 10;

        return (
          <button
            key={idx}
            onClick={() => onItemClick && onItemClick(idx)}
            className="absolute border-4 border-green-500 bg-green-500/20 hover:bg-green-500/40 transition-all z-10 flex items-start justify-center backdrop-blur-[1px] shadow-[0_0_15px_rgba(34,197,94,0.5)]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            {/* ETIQUETA FLOTANT (Només visible si hi ha espai) */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md border border-green-500/50 shadow-lg whitespace-nowrap flex items-center gap-1">
               <span>{item.name}</span>
               <span className="text-green-400 font-bold">x{item.quantity}</span>
            </div>
          </button>
        );
      })}
      
      {/* Overlay Text */}
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
         <p className="text-white/70 text-xs font-mono uppercase tracking-widest">
            Anàlisi completada
         </p>
      </div>
    </div>
  );
}