import { FOOD_PRESETS} from './foot-presets'; // Assegura't que la ruta és bona
import { ScannedItem } from '@/core/domain/types/ScannedItem';

export function enrichWithPreset(item: ScannedItem): ScannedItem {
  // 1. Normalitzem el nom escanejat
  const normalizedName = item.name.toLowerCase().trim();

  // 2. Busquem el millor match
  // Busquem si el nom del preset està DINS del nom escanejat o viceversa
  const match = FOOD_PRESETS.find(p => 
    normalizedName.includes(p.name.toLowerCase()) || 
    p.name.toLowerCase().includes(normalizedName)
  );

  if (match) {
    return {
      ...item,
      // Si la IA no ha trobat un nom molt concret, usem el del preset que és més maco
      name: item.name.length < 3 ? match.name : item.name, 
      // Afegim l'emoji del preset!
      // Nota: Com que ScannedItem no té camp emoji explícit al tipus original, 
      // l'hem de concatenar al nom o afegir-lo si ampliem el tipus.
      // Per ara, ho farem visualment al component, però aquí retornem la categoria bona.
      location: match.defaultLoc,
      unit: match.defaultUnit,
    };
  }

  return item;
}

// Helper per treure només l'emoji
export function getEmojiForName(name: string): string {
    const match = FOOD_PRESETS.find(p => 
        name.toLowerCase().includes(p.name.toLowerCase()) || 
        p.name.toLowerCase().includes(name)
    );
    return match ? match.emoji : '📦'; // Fallback
}