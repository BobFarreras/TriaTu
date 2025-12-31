'use client'

import { Clock } from 'lucide-react';
import { EditorData } from './types'; // ✅ IMPORT

const TAGS = [
  { id: 'vegan', label: 'Vegà' },
  { id: 'vegetarian', label: 'Veggie' },
  { id: 'gluten-free', label: 'No Gluten' },
  { id: 'quick', label: 'Ràpid' },
  { id: 'healthy', label: 'Healthy' },
];

interface Props {
    data: EditorData;
    update: (d: EditorData) => void; // ✅ ADÉU ANY
}

export function MetaControls({ data, update }: Props) {
  
  const toggleTag = (id: string) => {
    update({
        ...data,
        dietaryTags: data.dietaryTags.includes(id) 
            ? data.dietaryTags.filter(t => t !== id)
            : [...data.dietaryTags, id]
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
       
       {/* ESQUERRA: Títol i Temps */}
       <div className="flex-1 w-full md:w-auto flex flex-col gap-4">
          <input 
            value={data.name}
            onChange={(e) => update({ ...data, name: e.target.value })}
            placeholder="Nom de la recepta..."
            className="bg-transparent text-3xl font-black text-white placeholder:text-slate-700 outline-none w-full"
          />
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                  <Clock size={16} className="text-purple-400" />
                  <input 
                    type="number"
                    value={data.prepTimeMinutes}
                    onChange={(e) => update({ ...data, prepTimeMinutes: Number(e.target.value) })}
                    className="bg-transparent w-10 text-white font-bold outline-none text-right"
                  />
                  <span className="text-xs text-slate-500 font-bold">min</span>
              </div>
          </div>
       </div>

       {/* DRETA: Tags Ràpids */}
       <div className="flex flex-wrap gap-2 justify-end">
          {TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    data.dietaryTags.includes(tag.id)
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                }`}
              >
                {tag.label}
              </button>
          ))}
       </div>
    </div>
  );
}