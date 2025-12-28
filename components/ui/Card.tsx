export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm ${className}`}>
      {children}
    </div>
  );
}