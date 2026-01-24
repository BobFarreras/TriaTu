'use client';

import { Users, User, ChevronDown } from 'lucide-react';

interface Props {
  scope: string;
  setScope: (val: string) => void;
  rooms: { id: string; name: string }[];
  personalLabel?: string;
  sharedLabel?: string;
  testId?: string;
  className?: string;
}

export function ScopeSelector({
  scope,
  setScope,
  rooms,
  personalLabel = 'Personal',
  sharedLabel = 'Sales Compartides',
  testId,
  className
}: Props) {
  if (rooms.length === 0) return null;

  return (
    <div className={`relative group ${className || ''}`.trim()}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
        {scope === 'PERSONAL' ? <User size={14} /> : <Users size={14} />}
      </div>
      <select
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        data-testid={testId}
        className="appearance-none bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium py-2 pl-9 pr-8 rounded-full border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="PERSONAL">👤 {personalLabel}</option>
        <optgroup label={sharedLabel}>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>🏠 {room.name}</option>
          ))}
        </optgroup>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        <ChevronDown size={12} />
      </div>
    </div>
  );
}
