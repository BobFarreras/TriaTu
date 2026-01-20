import { describe, it, expect } from 'vitest';
import { getSafeImageUrl } from './imageUtils';

describe('getSafeImageUrl (Image Proxy Adapter)', () => {

  it('hauria de retornar undefined si la URL és buida o null', () => {
    expect(getSafeImageUrl(null)).toBeUndefined();
    expect(getSafeImageUrl(undefined)).toBeUndefined();
    expect(getSafeImageUrl('')).toBeUndefined();
  });

  it('hauria de deixar passar URLs segures sense modificar-les', () => {
    const safeUrl = 'https://via.placeholder.com/150';
    const result = getSafeImageUrl(safeUrl);
    
    expect(result).toBe(safeUrl);
    expect(result).not.toContain('wsrv.nl');
  });

  it('hauria de transformar URLs de Bonpreu per passar pel proxy', () => {
    const restrictedUrl = 'https://www.compraonline.bonpreuesclat.cat/images/producte123.jpg';
    const result = getSafeImageUrl(restrictedUrl);

    // 1. Ha de fer servir el domini del proxy
    expect(result).toContain('https://wsrv.nl/?url=');
    
    // 2. La URL original ha d'estar codificada (URL Encoded) dins
    expect(result).toContain(encodeURIComponent(restrictedUrl));
    
    // 3. Ha d'incloure paràmetres d'optimització (opcional, segons la teva impl)
    expect(result).toContain('output=webp');
  });

  it('hauria de gestionar correctament caràcters especials en la URL original', () => {
    // Simulem una URL amb espais o caràcters estranys
    const trickyUrl = 'https://www.compraonline.bonpreuesclat.cat/images/foto del pa.jpg';
    const result = getSafeImageUrl(trickyUrl);

    // Verifiquem que s'ha codificat bé (espai -> %20)
    expect(result).toContain('foto%20del%20pa.jpg');
  });

});