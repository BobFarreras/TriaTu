'use client'

import { publishRecipeAction } from '@/app/actions/community';
import { useRef } from 'react';

export function CreateRecipeForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await publishRecipeAction(formData);
    if (result?.error) {
      alert(result.error);
    } else {
      alert("Recepta publicada!");
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="p-4 border rounded bg-white shadow-sm space-y-4">
      <h3 className="font-bold text-lg">Nova Recepta</h3>
      
      <div>
        <label className="block text-sm font-medium">Títol</label>
        <input name="title" required className="w-full border p-2 rounded" placeholder="Ex: Truita de patates" />
      </div>

      <div>
        <label className="block text-sm font-medium">Ingredients (separats per coma)</label>
        <textarea name="ingredients" required className="w-full border p-2 rounded" placeholder="Ous, Patates, Oli, Sal" />
      </div>

      <div>
        <label className="block text-sm font-medium">Passos (un per línia)</label>
        <textarea name="steps" required className="w-full border p-2 rounded" placeholder="Tallar patates&#10;Fregir&#10;Batre ous" />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        Publicar Recepta
      </button>
    </form>
  );
}