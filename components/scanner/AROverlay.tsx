// src/components/scanner/AROverlay.tsx
import { ScannedItem } from "@/core/domain/types/ScannedItem";
import Image from 'next/image';

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
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt="Captured"
          fill
          sizes="100vw"
          unoptimized
          className="object-contain"
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
              {/* ETIQUETA MILLORADA */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold p-1 pr-3 rounded-full shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-slate-700">

                {/* Si tenim imatge de catàleg, la mostrem petita */}
                {item.catalogImage ? (
                  <Image
                    src={item.catalogImage}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="w-8 h-8 object-contain bg-white rounded-full"
                  />
                ) : (
                  <span className="text-xl pl-1">{item.emoji}</span>
                )}

                <div className="flex flex-col text-left">
                  <span className="max-w-25 truncate">{item.name}</span>
                  {item.price && <span className="text-emerald-400">{item.price}€</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
