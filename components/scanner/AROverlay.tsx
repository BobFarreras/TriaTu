// src/components/AROverlay.tsx
import { ScannedItem } from "@/core/domain/types/ScannedItem";

interface AROverlayProps {
  imageSrc: string; 
  items: ScannedItem[];
  onItemClick?: (index: number) => void;
}

export function AROverlay({ imageSrc, items, onItemClick }: AROverlayProps) {
  return (
    // Canviem el fons a negre absolut perquè la imatge potser no ocupa tot l'espai ara
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden z-50">
      
      {/* ✅ CANVI CLAU: 'object-contain' en lloc de 'object-cover'.
         Això garanteix que veiem la foto SENCERA tal com la va veure Gemini.
         Potser apareixen franges negres a dalt/baix, però les caixes quadraran.
      */}
      <img 
        src={imageSrc} 
        alt="Captured" 
        className="max-w-full max-h-full object-contain opacity-90" 
      />

      {/* El contenidor dels requadres ha de tenir la mateixa mida i posició que la imatge real.
         Això és un truc: fem servir un div absolut a sobre, però com que 'object-contain'
         és difícil de mapejar, la millor opció ràpida és pintar els botons relatius
         al contenidor pare si la imatge ocupa el màxim possible.
         
         NOTA: Si amb object-contain encara es mouen, el següent pas seria passar
         les dimensions reals de la imatge, però provem primer això.
      */}
      
      {/* CONTENIDOR DE CAPA SUPERPOSADA (Absolute full per simplificar coordenades %) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Important: pointer-events-none al contenidor gran per no bloquejar, 
            però pointer-events-auto als botons */}
            
        {items.map((item, idx) => {
          if (!item.box2d || item.box2d.length < 4) return null;

          const [ymin, xmin, ymax, xmax] = item.box2d;
          
          // Gemini: 0..1000 -> CSS: 0..100%
          const top = ymin / 10;
          const left = xmin / 10;
          const height = (ymax - ymin) / 10;
          const width = (xmax - xmin) / 10;

          return (
            <button
              key={idx}
              onClick={() => onItemClick && onItemClick(idx)}
              className="absolute border-[3px] border-blue-400 z-50 hover:bg-blue-400/20 pointer-events-auto transition-all shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >
              <div className="absolute -top-8 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                  {item.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}