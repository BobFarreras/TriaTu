// =================== FILE: src/components/ui/product-image.tsx ===================
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ProductImage = ({ src, alt, className }: ProductImageProps) => {
  // Detectem si la imatge ve de Bonpreu per aplicar l'estratègia
  const isExternalRestricted = src.includes('bonpreuesclat.cat');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        // 👇 SOLUCIÓ: Si és de Bonpreu, saltem l'optimitzador de Vercel
        // Això fa que el navegador la demani directament a Bonpreu.
        unoptimized={isExternalRestricted} 
      />
    </div>
  );
};