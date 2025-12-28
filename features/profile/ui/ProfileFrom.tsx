// =================== FILE: features/profile/ui/ProfileFrom.tsx ===================

'use client'

import { useActionState, useState } from 'react';
import { updateProfileAction } from '@/app/actions/profile-actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TagInput } from '@/components/ui/TagInput';
import { SearchableSectionGrid } from '@/components/ui/SearchableSectionGrid'; 
import { EXCLUSION_DATA, FOOD_DATA } from '@/core/constants/profile-data'; 

type ProfileData = {
  foodPreferences: string[];
  exclusions: string[];
  socialTolerance: number;
};

const getAllIds = (categories: typeof EXCLUSION_DATA) => 
  categories.flatMap(c => c.items.map(i => i.id));

export function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const [state, action, isPending] = useActionState(updateProfileAction, {});
  
  const knownFoodIds = getAllIds(FOOD_DATA);
  const knownExclusionIds = getAllIds(EXCLUSION_DATA);

  // Estat visual
  const [selectedFood, setSelectedFood] = useState<string[]>(
    initialData.foodPreferences.filter(f => knownFoodIds.includes(f))
  );

  const [selectedExclusions, setSelectedExclusions] = useState<string[]>(
    initialData.exclusions.filter(ex => knownExclusionIds.includes(ex))
  );
  
  // Estat local per al slider de tolerància (per mostrar el valor en temps real)
  const [tolerance, setTolerance] = useState(initialData.socialTolerance);

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <form action={action} className="space-y-12">
        
        {/* SECCIÓ 1: MENJAR PREFERIT (Estil VERD) */}
        <section className="relative">
          {/* Capçalera Decorativa */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center text-4xl shadow-sm border-2 border-green-200 dark:border-green-800 rotate-3">
              😋
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                El teu Menú
              </h2>
              <p className="text-gray-500 font-medium">Què t'agrada menjar habitualment?</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border-4 border-gray-100 dark:border-zinc-800 border-b-[8px] p-6 shadow-sm">
            <SearchableSectionGrid 
              data={FOOD_DATA}
              selectedValues={selectedFood}
              onChange={setSelectedFood}
              placeholder="🍕 Buscar menjar (ex: Sushi...)"
              accentColor="green" // Nou prop per colorejar
            />
          </div>
          
          <input type="hidden" name="foodPreferences" value={selectedFood.join(',')} />
        </section>

        {/* SECCIÓ 2: EXCLUSIONS (Estil VERMELL/TARONJA) */}
        <section className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center text-4xl shadow-sm border-2 border-red-200 dark:border-red-800 -rotate-2">
              🚫
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                La Llista Negra
              </h2>
              <p className="text-gray-500 font-medium">Al·lèrgies i coses que no suportes.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border-4 border-red-100 dark:border-red-900/30 border-b-[8px] p-6 shadow-sm mb-6">
            <SearchableSectionGrid 
              data={EXCLUSION_DATA}
              selectedValues={selectedExclusions}
              onChange={setSelectedExclusions}
              placeholder="🥜 Buscar al·lèrgia (ex: Gluten...)"
              accentColor="red"
            />
          </div>
          
          <input type="hidden" name="exclusions_base" value={selectedExclusions.join(',')} />

          {/* CAIXA EXTRA (Estil Alerta) */}
          <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-800/50 relative">
             <div className="absolute -top-3 left-6 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 text-xs font-black px-3 py-1 rounded-full border border-orange-200 uppercase tracking-wide">
               ⚠️ Extra
             </div>
             <p className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-4 mt-2">
               T'has deixat alguna cosa específica?
             </p>
             <TagInput 
               label="Escriu i prem Enter:" 
               name="exclusions_extra" 
               placeholder="ex: Coriandre, Préssec..."
               defaultValue={initialData.exclusions.filter(ex => !knownExclusionIds.includes(ex))}
             />
          </div>
        </section>

        {/* SECCIÓ 3: TOLERÀNCIA (Estil BLAU) */}
        <section className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center text-4xl shadow-sm border-2 border-blue-200 dark:border-blue-800 rotate-1">
              🤝
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                Flexibilitat
              </h2>
              <p className="text-gray-500 font-medium">Com de fàcil ets de convèncer?</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border-4 border-blue-100 dark:border-blue-900/30 border-b-[8px]">
            <div className="text-center mb-8">
               <span className="text-6xl mb-2 block animate-bounce">
                 {tolerance < 4 ? '😤' : tolerance > 7 ? '😇' : '😐'}
               </span>
               <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                 {tolerance < 4 ? 'NO NEGOCIABLE' : tolerance > 7 ? 'M\'ADAPTO A TOT' : 'NI FU NI FA'}
               </p>
            </div>

            <input 
              type="range" 
              name="socialTolerance"
              min="1" 
              max="10" 
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500 hover:accent-blue-400"
            />
            
            <div className="flex justify-between text-xs font-black text-gray-400 mt-4 uppercase tracking-widest">
               <span>Rígid</span>
               <span>Flexible</span>
            </div>
          </div>
        </section>

        {/* BARRA FLOTANT D'ACCIÓ */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-zinc-800 z-50 flex items-center justify-center gap-4 shadow-2xl">
          <div className="w-full max-w-4xl flex gap-4">
             {/* FEEDBACK INTEGRAT (si hi ha èxit o error) */}
             {state.success && <div className="hidden md:flex items-center text-green-600 font-bold bg-green-50 px-4 rounded-xl border border-green-200">✅ Guardat!</div>}
             
             <Button 
               type="submit" 
               className="flex-1 py-4 text-lg bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 border-b-4 border-gray-600 dark:border-gray-400" 
               isLoading={isPending}
             >
               💾 Guardar Canvis
             </Button>
          </div>
        </div>

      </form>
    </div>
  );
}