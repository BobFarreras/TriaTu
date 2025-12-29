// src/components/scanner/AROverlay.tsx
import { ScannedItem } from "@/core/domain/types/ScannedItem";

interface AROverlayProps {
  imageSrc: string;
  items: ScannedItem[];
  onItemClick?: (index: number) => void;
}

export function AROverlay({ imageSrc, items, onItemClick }: AROverlayProps) {
  
  return (
    // 1. Contenidor Base: Ocupa tot l'espai disponible (negre) i CENTRA el contingut
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center">
      
      {/* 2. Wrapper d'Imatge:
           És 'relative' perquè els botons es posicionin respecte a ELL.
           No té mida fixa, s'encongeix per abraçar la imatge (gràcies al flex pare).
      */}
      <div className="relative max-w-full max-h-full">
        <img 
          src={imageSrc} 
          alt="Captured" 
          // 3. Imatge: 'max-w-full max-h-full' fa que mai sigui més gran que la pantalla,
          // mantenint la proporció original (aspect ratio) sense retallar res.
          className="max-w-full max-h-full object-contain block" 
        />

        {items.map((item, idx) => {
          // Validació de seguretat
          if (!item.box2d || item.box2d.length < 4) return null;

          const [ymin, xmin, ymax, xmax] = item.box2d;
          
          // Conversió de coordenades 1000 -> %
          const top = ymin / 10;
          const left = xmin / 10;
          const height = (ymax - ymin) / 10;
          const width = (xmax - xmin) / 10;

          return (
            <button
              key={idx}
              onClick={() => onItemClick && onItemClick(idx)}
              className="absolute border-[3px] border-blue-400 z-50 hover:bg-blue-400/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.6)] group"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >
              {/* Etiqueta flotant (Només visible si hi ha espai o en hover) */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 {item.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}