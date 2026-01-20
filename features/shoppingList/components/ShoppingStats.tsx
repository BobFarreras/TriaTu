// ARXIU: src/features/shoppingList/components/ShoppingStats.tsx
interface Props {
    grandTotal: number;
    cartTotal: number;
}

export function ShoppingStats({ grandTotal, cartTotal }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Llista" amount={grandTotal} />
            <StatCard label="Al Carret" amount={cartTotal} isHighlight />
        </div>
    );
}

function StatCard({ label, amount, isHighlight = false }: { label: string; amount: number; isHighlight?: boolean }) {
    return (
        <div className={`
            p-4 rounded-2xl border flex flex-col items-center relative overflow-hidden
            ${isHighlight ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-slate-900/50 border-slate-800'}
        `}>
            {isHighlight && <div className="absolute inset-0 bg-emerald-500/5 blur-xl"></div>}
            <span className={`text-[10px] uppercase tracking-wider font-bold relative z-10 ${isHighlight ? 'text-emerald-400' : 'text-slate-500'}`}>
                {label}
            </span>
            <span className={`text-2xl font-black relative z-10 ${isHighlight ? 'text-emerald-400' : 'text-white'}`}>
                {amount.toFixed(2)}€
            </span>
        </div>
    );
}
