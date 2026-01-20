'use client';

import { motion } from 'framer-motion';
import { ChefHat, ListChecks, Settings2 } from 'lucide-react';

export type TabType = 'meta' | 'ingredients' | 'steps';

interface Props {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  errors: { name: boolean; ingredients: boolean; steps: boolean };
  counts: { ingredients: number; steps: number };
}

export function EditorTabs({ activeTab, onChange, errors, counts }: Props) {
  return (
    <div className="shrink-0 px-4 py-2 bg-slate-950 border-b border-slate-900 z-40">
      <div id="tour-tabs" className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800/50 relative max-w-lg mx-auto">
        <motion.div
          layoutId="activeTab"
          className="absolute inset-y-1 rounded-lg bg-slate-800 shadow-sm"
          initial={false}
          animate={{
            left: activeTab === 'meta' ? '1%' : activeTab === 'ingredients' ? '34%' : '67%',
            width: '32%'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <TabButton
          active={activeTab === 'meta'}
          onClick={() => onChange('meta')}
          error={errors.name}
          icon={<Settings2 size={16} />}
          label="Info"
        />
        <TabButton
          active={activeTab === 'ingredients'}
          onClick={() => onChange('ingredients')}
          error={errors.ingredients}
          icon={<ChefHat size={16} />}
          label="Ingredients"
          count={counts.ingredients}
        />
        <TabButton
          active={activeTab === 'steps'}
          onClick={() => onChange('steps')}
          error={errors.steps}
          icon={<ListChecks size={16} />}
          label="Passos"
          count={counts.steps}
        />
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean; onClick: () => void; error: boolean; icon: React.ReactNode; label: string; count?: number;
}

function TabButton({ active, onClick, error, icon, label, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${error ? 'text-red-400 animate-pulse' : (active ? 'text-white' : 'text-slate-500 hover:text-slate-300')}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && count > 0 && !error && <span className="bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ml-1">{count}</span>}
    </button>
  );
}
