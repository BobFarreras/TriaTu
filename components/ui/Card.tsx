// =================== FILE: components/ui/Card.tsx ===================
// Fem que les targetes semblin "panells flotants"
export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`
      p-6 
      bg-white dark:bg-zinc-900 
      rounded-3xl 
      border-2 border-gray-100 dark:border-zinc-800 
      border-b-[6px] 
      shadow-sm
      ${className}
    `}>
      {children}
    </div>
  );
}