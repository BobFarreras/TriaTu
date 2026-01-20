import { NextResponse } from 'next/server';
import { enrichProduct } from '@/experiments/product-mapper';
// ✅ Importem els tipus
import { BonpreuSearchResponse } from '@/experiments/bonpreu-types';
import { error as logError } from '@/lib/logger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) return NextResponse.json({ products: [] });
  if (query.length > 100) return NextResponse.json({ error: 'Query massa llarga' }, { status: 400 });

  const url = `https://www.compraonline.bonpreuesclat.cat/api/webproductpagews/v6/product-pages/search?includeAdditionalPageInfo=true&maxPageSize=50&maxProductsToDecorate=30&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    
    // ✅ CLAU: Diem a TypeScript: "Confia en mi, això és un BonpreuSearchResponse"
    const data = (await response.json()) as BonpreuSearchResponse;

    // Ara TypeScript ja sap que 'productGroups' existeix, no cal 'any'
    const rawProducts = data.productGroups
      ?.filter(g => g.type === 'cluster') // 'g' ja té tipus automàticament
      .flatMap(g => g.decoratedProducts) || [];

    // 'p' també té tipus automàticament
    const products = rawProducts.map(p => enrichProduct(p));

    return NextResponse.json({ products });

  } catch (e) {
    // Gestió d'errors neta
    logError('Bonpreu fetch failed', e);
    return NextResponse.json({ error: 'Error fetching Bonpreu' }, { status: 500 });
  }
}