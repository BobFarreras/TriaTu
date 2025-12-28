// =================== FILE: components/ui/Card.tsx ===================
export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`
      p-6 
      /* FONS: Fosc amb una mica de transparència i blur */
      bg-zinc-900/90 backdrop-blur-md
      
      /* VORES: Arrodonides i fosques */
      rounded-[2rem] 
      border-2 border-zinc-800 
      border-b-[6px] 
      
      /* OMBRA: Subtil i fosca */
      shadow-xl shadow-black/20
      
      ${className}
    `}>
      {children}
    </div>
  );
}