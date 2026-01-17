export function getDishEmoji(name: string): string {
  if (!name) return '🍽️';

  const n = name.toLowerCase();

  // 🍕 Fast Food / Casual
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger') || n.includes('hamburg')) return '🍔';
  if (n.includes('taco') || n.includes('fajita') || n.includes('burrito')) return '🌮';
  if (n.includes('entrep') || n.includes('bocata') || n.includes('sandwich') || n.includes('bikini')) return '🥪';
  if (n.includes('frit') || n.includes('fregit') || n.includes('croquet')) return '🍟';

  // 🍝 Pasta & Arròs
  if (n.includes('pasta') || n.includes('espagueti') || n.includes('macarron') || n.includes('ravioli')) return '🍝';
  if (n.includes('arròs') || n.includes('paella') || n.includes('risotto')) return '🥘';
  if (n.includes('fideu')) return '🍜';

  // 🥗 Saludable / Verdures
  if (n.includes('amanida') || n.includes('enciam') || n.includes('salad') || n.includes('verd')) return '🥗';
  if (n.includes('sopa') || n.includes('crema') || n.includes('brou')) return '🥣';
  if (n.includes('albergínia') || n.includes('carbassó') || n.includes('pastanaga')) return '🥦';

  // 🥩 Proteïna
  if (n.includes('pollastre') || n.includes('pavo') || n.includes('au')) return '🍗';
  if (n.includes('carn') || n.includes('vedella') || n.includes('porc') || n.includes('filet') || n.includes('xai')) return '🥩';
  if (n.includes('sushi') || n.includes('maki')) return '🍣';
  if (n.includes('peix') || n.includes('luç') || n.includes('bacalla') || n.includes('salm') || n.includes('gamba')) return '🐟';
  if (n.includes('ou') || n.includes('truita') || n.includes('remenat')) return '🍳';

  // 🍰 Postres
  if (n.includes('postre') || n.includes('pastís') || n.includes('cake') || n.includes('tiramisú')) return '🍰';
  if (n.includes('gelat')) return '🍦';
  if (n.includes('xocolata') || n.includes('bombó')) return '🍫';
  if (n.includes('fruita') || n.includes('poma') || n.includes('maduixa')) return '🍎';
  if (n.includes('galet')) return '🍪';

  // 🥖 Acompanyaments
  if (n.includes('pa ') || n.includes('torrada')) return '🥖';
  if (n.includes('formatge')) return '🧀';

  return '🍽️';
}