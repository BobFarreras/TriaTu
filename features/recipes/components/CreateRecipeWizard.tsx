'use client'

import { useState, ChangeEvent } from 'react';
import { publishRecipeAction } from '@/app/actions/community';

// Tipus estrictes
type UnitType = 'ut' | 'g' | 'kg' | 'l' | 'ml' | 'cullerada';

interface IngredientUi {
  name: string;
  quantity: number;
  unit: UnitType;
}

export function CreateRecipeWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState(20);
  const [difficulty, setDifficulty] = useState('Mitjana');
  
  const [ingredients, setIngredients] = useState<IngredientUi[]>([]);
  const [currentIng, setCurrentIng] = useState<IngredientUi>({ name: '', quantity: 1, unit: 'ut' });

  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState('');

  // Handlers
  const addIngredient = () => {
    if (!currentIng.name.trim()) return;
    setIngredients([...ingredients, currentIng]);
    setCurrentIng({ name: '', quantity: 1, unit: 'ut' });
  };

  const addStep = () => {
    if (!currentStep.trim()) return;
    setSteps([...steps, currentStep]);
    setCurrentStep('');
  };

  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentIng({ ...currentIng, unit: e.target.value as UnitType });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('prepTime', prepTime.toString());
    formData.append('difficulty', difficulty);
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('steps', JSON.stringify(steps));

    const res = await publishRecipeAction(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setIngredients([]);
    setSteps([]);
    setStep(1);
  };

  // 🌑 Botó inicial "Card"
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-8 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-blue-500/50 hover:text-blue-400 hover:bg-zinc-900 transition-all group flex flex-col items-center gap-3"
      >
        <div className="w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg shadow-black/40">
            👨‍🍳
        </div>
        <span className="font-bold tracking-wide uppercase text-xs">Publicar nova recepta</span>
      </button>
    );
  }

  // 🌑 Wizard Modal/Card
  return (
    <div className="bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Steps Header */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/50">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 py-4 text-center text-xs font-black tracking-widest uppercase transition-colors 
            ${step === s ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-600'}`}>
            {s === 1 ? '1. Dades' : s === 2 ? '2. Ingredients' : '3. Passos'}
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8 min-h-[320px]">
        {/* PAS 1: INFO */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Títol de la Recepta</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-zinc-700" 
                placeholder="Ex: Macarrons de l'àvia..." 
                autoFocus 
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Temps (min)</label>
                <input 
                    type="number" 
                    value={prepTime} 
                    onChange={(e) => setPrepTime(Number(e.target.value))} 
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Dificultat</label>
                <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)} 
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Fàcil">🟢 Fàcil</option>
                  <option value="Mitjana">🟡 Mitjana</option>
                  <option value="Difícil">🔴 Difícil</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PAS 2: INGREDIENTS */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="flex gap-2 items-end bg-zinc-950 p-2 rounded-2xl border border-zinc-800">
              <div className="flex-[2]">
                <input 
                    value={currentIng.name} 
                    onChange={(e) => setCurrentIng({...currentIng, name: e.target.value})} 
                    className="w-full bg-transparent border-none p-2 text-white placeholder:text-zinc-600 focus:ring-0" 
                    placeholder="Nom (ex: Patates)" 
                    onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                />
              </div>
              <div className="w-20 border-l border-zinc-800">
                <input 
                    type="number" 
                    value={currentIng.quantity} 
                    onChange={(e) => setCurrentIng({...currentIng, quantity: Number(e.target.value)})} 
                    className="w-full bg-transparent border-none p-2 text-center text-white placeholder:text-zinc-600 focus:ring-0" 
                />
              </div>
              <div className="w-24 border-l border-zinc-800">
                  <select 
                    value={currentIng.unit} 
                    onChange={handleUnitChange} 
                    className="w-full bg-transparent border-none p-2 text-xs text-zinc-300 focus:ring-0"
                  >
                      <option value="ut">unitats</option>
                      <option value="g">grams</option>
                      <option value="kg">kg</option>
                      <option value="l">litres</option>
                      <option value="ml">ml</option>
                      <option value="cullerada">cull.</option>
                  </select>
              </div>
              <button onClick={addIngredient} className="bg-emerald-600 text-white w-10 h-9 rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center text-lg font-bold">＋</button>
            </div>

            <div className="bg-zinc-950/50 rounded-2xl p-4 min-h-[160px] space-y-2 border border-zinc-800/50">
              {ingredients.length === 0 && <div className="text-zinc-700 text-center py-10 text-sm">Afegeix ingredients a dalt...</div>}
              {ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-zinc-800 animate-in zoom-in-95 duration-100">
                  <span className="text-zinc-200 text-sm"><span className="font-mono text-emerald-400 font-bold">{ing.quantity}{ing.unit}</span> {ing.name}</span>
                  <button onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="text-zinc-600 hover:text-red-400 px-2 transition-colors">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAS 3: PASSOS */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
             <div className="flex gap-2">
                <textarea 
                    value={currentStep} 
                    onChange={(e) => setCurrentStep(e.target.value)} 
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    placeholder="Descriu el pas..." 
                    rows={2} 
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addStep())}
                />
                <button onClick={addStep} className="bg-emerald-600 text-white w-14 rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center font-bold text-xl">＋</button>
             </div>
             
             <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
              {steps.map((s, i) => (
                  <div key={i} className="flex gap-4 items-start bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-in slide-in-from-bottom-2 duration-200">
                      <span className="bg-zinc-800 text-zinc-300 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 border border-zinc-700">{i+1}</span>
                      <p className="text-sm text-zinc-300 flex-1 leading-relaxed">{s}</p>
                      <button onClick={() => setSteps(steps.filter((_, idx) => idx !== i))} className="text-zinc-600 hover:text-red-400 text-xs mt-1">esborrar</button>
                  </div>
              ))}
             </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="text-zinc-400 px-4 py-2 hover:text-white text-sm font-bold transition-colors">← Enrere</button>
        ) : (
          <button onClick={() => setIsOpen(false)} className="text-red-400 px-4 py-2 hover:text-red-300 text-sm font-bold transition-colors">Tancar</button>
        )}
        
        {step < 3 ? (
           <button 
             onClick={() => setStep(step + 1)} 
             disabled={step === 1 && !title.trim()} 
             className="bg-blue-600 text-white px-8 py-2.5 rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:grayscale font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
           >
             Següent
           </button>
        ) : (
           <button 
             onClick={handleSubmit} 
             disabled={loading || steps.length === 0} 
             className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-2.5 rounded-full hover:brightness-110 disabled:opacity-50 font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-2"
           >
             {loading ? 'Publicant...' : '🚀 Publicar'}
           </button>
        )}
      </div>
    </div>
  );
}
