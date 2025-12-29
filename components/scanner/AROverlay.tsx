// src/components/AROverlay.tsx
import { ScannedItem } from "@/core/domain/types/ScannedItem"; // Assegura que la ruta és correcta

interface AROverlayProps {
  imageSrc: string;
  items: ScannedItem[];
  onItemClick?: (index: number) => void;
}

export function AROverlay({ imageSrc, items, onItemClick }: AROverlayProps) {
  // Debug visual
  if (items.length > 0) {
    console.log("Overlay renderitzant items:", items.length);
  }

  return (
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-slate-700 shadow-2xl group">
      <img 
        src={imageSrc} 
        alt="Captured" 
        className="w-full h-full object-cover opacity-90" 
      />

      {items.map((item, idx) => {
        if (!item.box2d || item.box2d.length < 4) return null;

        const [ymin, xmin, ymax, xmax] = item.box2d;
        
        // Gemini retorna coordenades 0-1000. Passem a percentatge.
        const top = ymin / 10;
        const left = xmin / 10;
        const height = (ymax - ymin) / 10;
        const width = (xmax - xmin) / 10;

        return (
          <button
            key={idx}
            onClick={() => onItemClick && onItemClick(idx)}
            className="absolute border-[3px] border-blue-400 z-50 hover:bg-blue-400/10 transition-all shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            <div className="absolute -top-7 left-0 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                {item.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}