import { Users, User, ChevronDown } from 'lucide-react';

interface Props {
  scope: string;
  setScope: (val: string) => void;
  rooms: { id: string; name: string }[];
}

export function ShoppingListContextSelector({ scope, setScope, rooms }: Props) {
  if (rooms.length === 0) return null;

  return (
    <div className="relative group shrink-0">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-300 pointer-events-none">
        {scope === 'PERSONAL' ? <User size={14} /> : <Users size={14} />}
      </div>
      <select
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="appearance-none bg-slate-950/70 hover:bg-slate-900 text-slate-100 text-xs font-semibold py-2 pl-9 pr-8 rounded-full border border-amber-400/20 hover:border-amber-400/60 shadow-[0_0_0_1px_rgba(251,191,36,0.08)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/30"
      >
        <option value="PERSONAL">Compra Personal</option>
        <optgroup label="Sales Compartides">
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </optgroup>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300/70 pointer-events-none">
        <ChevronDown size={12} />
      </div>
    </div>
  );
}
