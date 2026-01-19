// =================== FILE: src/lib/imageUtils.ts ===================
export function getSafeImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  // Si és Bonpreu, el passem pel proxy que neteja el rastre i afegeix CORS
  if (url.includes('bonpreuesclat.cat')) {
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=600&output=webp`;
  }

  return url;
}