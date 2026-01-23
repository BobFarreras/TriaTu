import { Users, User, ChevronDown } from 'lucide-react';

interface Props {
  scope: string;
  setScope: (val: string) => void;
  rooms: { id: string; name: string }[];
}

export function InventoryContextSelector({ scope, setScope, rooms }: Props) {
  if (rooms.length === 0) return null;

  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
        {scope === 'PERSONAL' ? <User size={14} /> : <Users size={14} />}
      </div>
      <select
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        data-testid="inventory-scope-select"
        className="appearance-none bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium py-2 pl-9 pr-8 rounded-full border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="PERSONAL">👤 Inventari Personal</option>
        <optgroup label="Sales Compartides">
          {rooms.map(r => <option key={r.id} value={r.id}>🏠 {r.name}</option>)}
        </optgroup>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        <ChevronDown size={12} />
      </div>
    </div>
  );
}
