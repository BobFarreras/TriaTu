import { createClient } from '@/adapters/supabase/server';
import { ScannedItem } from '@/core/domain/types/ScannedItem';

export class ProductMatcherService {
  
  /**
   * Rep una llista d'items genèrics (de Gemini) i intenta trobar
   * el producte real al catàleg de Bonpreu.
   */
  async enrichItems(items: ScannedItem[]): Promise<ScannedItem[]> {
    const supabase = await createClient();
    
    // Fem les cerques en paral·lel per velocitat
    const promises = items.map(async (item) => {
      if (!item.name) return item;

      // 1. Cerca Fuzzy a Supabase
      // Busquem productes que tinguin paraules similars al nom detectat
      // Utilitzem 'websearch_to_tsquery' o 'ilike' segons configuració
      const { data: matches, error } = await supabase
        .from('product_catalog')
        .select('*')
        .textSearch('name', `'${item.name}'`, { 
            type: 'websearch', 
            config: 'catalan' 
        })
        .limit(1); // Ens quedem amb el millor candidat

      if (error || !matches || matches.length === 0) {
        // Si no trobem res, retornem l'item genèric tal qual
        console.log(`⚠️ No s'ha trobat match per: ${item.name}`);
        return item;
      }

      const match = matches[0];
      console.log(`✅ MATCH TROBAT: ${item.name} -> ${match.name}`);

      // 2. Fusionem les dades
      return {
        ...item,
        // Sobreescrivim amb dades reals si volem, o les guardem a part
        name: match.name, // Posem el nom oficial (ex: "LLET SEMI BONPREU")
        productId: match.id,
        catalogImage: match.image_url,
        price: Number(match.price),
        matchConfidence: 1.0
      };
    });

    return Promise.all(promises);
  }
}