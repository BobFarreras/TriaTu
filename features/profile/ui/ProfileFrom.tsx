'use client'

import { useActionState, useState } from 'react';
import { updateProfileAction } from '@/app/actions/profile-actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TagInput } from '@/components/ui/TagInput';
import { SearchableSectionGrid } from '@/components/ui/SearchableSectionGrid'; // Nou component
import { EXCLUSION_DATA, FOOD_DATA } from '@/core/constants/profile-data'; // Noves dades

type ProfileData = {
  foodPreferences: string[];
  exclusions: string[];
  socialTolerance: number;
};

// Funció auxiliar per aplanar els IDs de les dades categoritzades
// (per saber quins IDs formen part de la llista "base" i quins són "extra")
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

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-none md:border md:shadow-sm">
      <form action={action} className="space-y-12">
        
        {/* SECCIÓ 1: MENJAR PREFERIT */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">😋</span>
            <div>
              <h2 className="text-xl font-bold">Què t'agrada menjar?</h2>
              <p className="text-sm text-gray-500">Selecciona les teves cuines i plats favorits.</p>
            </div>
          </div>
          
          <SearchableSectionGrid 
            data={FOOD_DATA}
            selectedValues={selectedFood}
            onChange={setSelectedFood}
            placeholder="Buscar menjar (ex: Sushi, Pizza...)"
          />
          
          <input type="hidden" name="foodPreferences" value={selectedFood.join(',')} />
        </section>

        <hr className="border-gray-100 dark:border-zinc-800" />

        {/* SECCIÓ 2: EXCLUSIONS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🚫</span>
            <div>
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Restriccions</h2>
              <p className="text-sm text-gray-500">Al·lèrgies, intoleràncies i coses que odies.</p>
            </div>
          </div>

          <SearchableSectionGrid 
            data={EXCLUSION_DATA}
            selectedValues={selectedExclusions}
            onChange={setSelectedExclusions}
            placeholder="Buscar al·lèrgia (ex: Gluten, Ceba...)"
          />
          
          <input type="hidden" name="exclusions_base" value={selectedExclusions.join(',')} />

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-800/30 mt-6">
             <p className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-2">
               ⚠️ T'has deixat alguna cosa?
             </p>
             <TagInput 
               label="Escriu altres exclusions aquí:" 
               name="exclusions_extra" 
               placeholder="Escriu i prem Enter..."
               defaultValue={initialData.exclusions.filter(ex => !knownExclusionIds.includes(ex))}
             />
          </div>
        </section>

        <hr className="border-gray-100 dark:border-zinc-800" />

        {/* SECCIÓ 3: TOLERÀNCIA */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤝</span>
            <h2 className="text-xl font-bold">Flexibilitat</h2>
          </div>
          
          <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-2xl">
            <label className="block text-center text-2xl font-bold mb-4">
              {/* Aquí podríem posar un valor dinàmic visual, però l'input ja fa la feina */}
              Nivell de Compromís
            </label>
            <input 
              type="range" 
              name="socialTolerance"
              min="1" 
              max="10" 
              defaultValue={initialData.socialTolerance}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-black dark:accent-white"
            />
            <div className="flex justify-between text-xs font-bold text-gray-500 mt-3 uppercase tracking-wider">
               <span>😤 Gens flexible</span>
               <span>😇 M'adapto a tot</span>
            </div>
          </div>
        </section>

        {/* FEEDBACK & BOTÓ FINAL */}
        <div className="sticky bottom-4 z-10">
          {state.error && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-xl text-center shadow-lg font-bold">{state.error}</div>}
          {state.success && <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-xl text-center shadow-lg font-bold animate-bounce">✅ Canvis guardats!</div>}
          
          <Button type="submit" className="w-full py-4 text-xl shadow-xl hover:scale-[1.01] transition-transform" isLoading={isPending}>
            Guardar Perfil
          </Button>
        </div>

      </form>
    </Card>
  );
}