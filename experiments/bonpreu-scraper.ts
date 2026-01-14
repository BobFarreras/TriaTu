// experiments/bonpreu-scraper.ts
import { BonpreuSearchResponse } from './bonpreu-types';

async function searchBonpreu(query: string) {
  console.log(`🕵️‍♂️ Espiant productes per: "${query}"...`);

  const url = `https://www.compraonline.bonpreuesclat.cat/api/webproductpagews/v6/product-pages/search?includeAdditionalPageInfo=true&maxPageSize=50&maxProductsToDecorate=30&q=${query}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json', // Simplificat per evitar problemes
        'Referer': 'https://www.compraonline.bonpreuesclat.cat/',
        'Origin': 'https://www.compraonline.bonpreuesclat.cat'
      }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    // ✅ SOLUCIÓ "NO ANY":
    // Fem un cast explícit a la nostra interfície. 
    // TypeScript confia que l'API retorna això perquè ho hem verificat al pas anterior.
    const data = (await response.json()) as BonpreuSearchResponse;

    // 🛡️ Protecció: Si l'array està buit o no existeix
    if (!data.productGroups || !Array.isArray(data.productGroups)) {
        console.error("⚠️ Estructura inesperada:", Object.keys(data));
        return;
    }

    // 🔄 LÒGICA ACTUALITZADA: Usem .productGroups
    const products = data.productGroups
      .filter(cluster => cluster.type === 'cluster')
      .flatMap(cluster => cluster.decoratedProducts)
      .map(p => ({
        id: p.productId,
        name: p.name.trim(), // Netegem espais extra
        price: p.price ? `${p.price.amount}€` : 'N/A',
        image: p.image?.src || 'No image'
      }));

    if (products.length === 0) {
        console.log("🤷‍♂️ No s'han trobat productes.");
    } else {
        console.table(products);
        console.log(`✅ ÈXIT: Trobats ${products.length} productes de Bonpreu!`);
    }

  } catch (error) {
    // TypeScript necessita saber que error és un Error per accedir a .message
    if (error instanceof Error) {
        console.error("❌ Error:", error.message);
    } else {
        console.error("❌ Error desconegut:", error);
    }
  }
}

searchBonpreu("Gorgonzola");