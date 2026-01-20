'use client'

import { publishRecipeAction } from '@/app/actions/community';
import { useRef } from 'react';

interface Props {
  labels: {
    title: string;
    label_title: string;
    placeholder_title: string;
    label_ingredients: string;
    placeholder_ingredients: string;
    label_steps: string;
    placeholder_steps: string;
    submit_btn: string;
    success: string;
    error_generic: string;
  }
}

export function CreateRecipeForm({ labels }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await publishRecipeAction(formData);
    if (result?.error) {
      alert(result.error);
    } else {
      // ✅ Usa el label traduït
      alert(labels.success);
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="p-4 border rounded bg-white shadow-sm space-y-4">
      <h3 className="font-bold text-lg">{labels.title}</h3>
      
      <div>
        <label className="block text-sm font-medium">{labels.label_title}</label>
        <input name="title" required className="w-full border p-2 rounded" placeholder={labels.placeholder_title} />
      </div>

      <div>
        <label className="block text-sm font-medium">{labels.label_ingredients}</label>
        <textarea name="ingredients" required className="w-full border p-2 rounded" placeholder={labels.placeholder_ingredients} />
      </div>

      <div>
        <label className="block text-sm font-medium">{labels.label_steps}</label>
        <textarea name="steps" required className="w-full border p-2 rounded" placeholder={labels.placeholder_steps} />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        {labels.submit_btn}
      </button>
    </form>
  );
}