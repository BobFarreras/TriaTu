'use client';

import { useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { addItemAction } from '@/app/actions/inventory';
import { FOOD_PRESETS, PRESET_CATEGORIES, FoodPreset, FoodCategory } from '@/lib/food-presets';
import { SmartDatePicker } from '../ui/SmartDatePicker';


type UnitType = 'ut' | 'kg' | 'l' | 'g';
const units: { val: UnitType; icon: string; labelKey: 'ut' | 'kg' | 'l' | 'g' }[] = [
  { val: 'ut', icon: '📦', labelKey: 'ut' },
  { val: 'kg', icon: '⚖️', labelKey: 'kg' },
  { val: 'l', icon: '💧', labelKey: 'l' },
  { val: 'g', icon: '🤏', labelKey: 'g' },
];

export function AddItemForm() {
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ESTATS
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📦');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<UnitType>('ut');
  const [location, setLocation] = useState('FRIDGE');
  const [expiryDate, setExpiryDate] = useState('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(null);

  // ✅ CORRECCIÓ: Tipat segur sense @ts-ignore
  const getLocalizedName = (preset: FoodPreset) => {
    // 1. Accedim de forma segura a l'objecte d'items (si encara no ha carregat, serà undefined)
    const items = t.food?.items;
    
    // 2. Fem un "Type Assertion" per dir-li a TS que tracti això com un diccionari clau-valor
    // Això és millor que ignorar l'error
    const localizedItems = items as Record<string, string> | undefined;

    // 3. Retornem la traducció o el nom original (fallback)
    return localizedItems?.[preset.id] || preset.name;
  };

  const selectPreset = (preset: FoodPreset) => {
    setName(getLocalizedName(preset)); // Utilitzem el nom traduït
    setEmoji(preset.emoji);
    setUnit(preset.defaultUnit);
    setLocation(preset.defaultLoc);
    setQuantity(1);
    setActiveCategory(null);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const step = unit === 'ut' ? 1 : 0.1;
      const newVal = prev + (delta * step);
      return Math.max(step, parseFloat(newVal.toFixed(2)));
    });
  };

  async function clientAction(formData: FormData) {
    setIsSubmitting(true);
    formData.set('name', name.trim());
    formData.set('emoji', emoji || '📦');

    const result = await addItemAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      alert(`⚠️ Error: ${result.error}`);
    } else {
      setName('');
      setEmoji('📦');
      setQuantity(1);
      setExpiryDate('');
      formRef.current?.reset();
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl">

      {/* 1. CATEGORIES */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`
                snap-start whitespace-nowrap px-5 py-3 rounded-full border text-sm font-bold transition-all
                ${activeCategory === cat
                  ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/50 scale-105'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              {/* Aquí també podríem traduir les categories si fos necessari, però de moment usem l'original */}
              {cat}
            </button>
          ))}
        </div>

        {/* Panell desplegable */}
        {activeCategory && (
          <div className="mt-4 p-6 bg-slate-950/50 rounded-3xl border border-slate-700 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 animate-in fade-in slide-in-from-top-4">
            {FOOD_PRESETS.filter(p => p.category === activeCategory).map(p => {
               const localizedName = getLocalizedName(p);
               return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPreset(p)}
                  className="group flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-slate-800 border border-transparent hover:border-slate-600 transition-all aspect-square relative"
                  title={localizedName}
                >
                  <span className="text-4xl mb-2 transition-transform group-hover:scale-125 drop-shadow-md">{p.emoji}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase truncate w-full text-center group-hover:text-purple-300">
                    {localizedName}
                  </span>
                </button>
               );
            })}
          </div>
        )}
      </div>

      <form ref={formRef} action={clientAction} className="space-y-8">

        {/* 2. INPUT NOM */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center shadow-inner focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
          <div className="w-16 h-16 flex items-center justify-center text-4xl bg-slate-900 rounded-xl border border-slate-800 shadow-sm shrink-0">
            {emoji}
          </div>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.inventory.form.name_placeholder}
            className="w-full bg-transparent border-none px-6 text-2xl md:text-3xl font-bold text-white placeholder-slate-700 outline-none h-16"
            autoComplete="off"
          />
        </div>

        {/* 3. GRAELLA DE CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Quantitat */}
          <div className="bg-slate-950/30 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between h-full">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t.inventory.form.quantity_label}</label>

            <div className="flex items-center gap-4 mb-6">
              <button type="button" onClick={() => handleQuantityChange(-1)} className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-3xl flex items-center justify-center active:scale-95 transition-all shadow-lg">−</button>
              <div className="flex-1 text-center bg-slate-900/50 rounded-2xl py-2 border border-slate-800/50">
                <span className="text-5xl font-black text-white tracking-tighter">{quantity}</span>
              </div>
              <button type="button" onClick={() => handleQuantityChange(1)} className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-3xl flex items-center justify-center active:scale-95 transition-all shadow-lg">+</button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {units.map((u) => (
                <button
                  key={u.val}
                  type="button"
                  onClick={() => setUnit(u.val)}
                  className={`py-3 rounded-xl text-xl transition-all border ${unit === u.val ? 'bg-slate-700 text-white border-slate-500 shadow-inner' : 'bg-slate-900 text-slate-600 border-slate-800 hover:bg-slate-800'}`}
                >
                  {u.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Ubicació + Data */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-950/30 p-1 rounded-2xl border border-slate-800 grid grid-cols-3 gap-1">
              {[
                { val: 'FRIDGE', icon: '❄️', label: t.inventory.form.location.fridge },
                { val: 'PANTRY', icon: '🚪', label: t.inventory.form.location.pantry },
                { val: 'FREEZER', icon: '🧊', label: t.inventory.form.location.freezer }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setLocation(opt.val)}
                  className={`
                    py-4 rounded-xl flex flex-col items-center gap-2 transition-all
                    ${location === opt.val
                      ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10'
                      : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                    }
                  `}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">{opt.label}</span>
                </button>
              ))}
            </div>

            <SmartDatePicker selectedDate={expiryDate} onDateSelect={setExpiryDate} />
          </div>
        </div>

        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="unit" value={unit} />
        <input type="hidden" name="location" value={location} />
        <input type="hidden" name="expiryDate" value={expiryDate} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-lg py-6 rounded-2xl shadow-xl shadow-purple-900/30 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 tracking-widest uppercase border-t border-white/20"
        >
          {isSubmitting ? t.inventory.actions.saving : t.inventory.actions.save}
        </button>

      </form>
    </div>
  );
}
