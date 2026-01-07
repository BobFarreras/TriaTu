// src/app/actions/auth-actions.ts
'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';

// ✅ Definim la interfície de resposta (Domain Layer)
// Això és Clean Code: definim el contracte del que retorna la nostra acció
export type AuthResult = { error: string } | void;

export async function login(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nextRaw = formData.get('next') as string;
  // Sanitize: Si next és buit o null, fallback a dashboard
  const next = nextRaw || '/dashboard';

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Retornem l'objecte d'error (compatible amb AuthResult)
    return { error: error.message };
  }

  // Prevenció Open Redirect
  const finalRedirect = next.startsWith('/') ? next : '/dashboard';

  revalidatePath('/', 'layout');
  // Redirect llança una excepció interna ("NEXT_REDIRECT"), per tant, tècnicament retorna `void` abans de sortir.
  redirect(finalRedirect);
}

export async function signup(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nextRaw = formData.get('next') as string;
  const next = nextRaw || '/dashboard';

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const finalRedirect = next.startsWith('/') ? next : '/dashboard';

  revalidatePath('/', 'layout');
  redirect(finalRedirect);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}