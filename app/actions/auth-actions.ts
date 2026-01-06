'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  // ✅ 1. Llegim el camp 'next' (o per defecte al dashboard)
  const next = (formData.get('next') as string) || '/dashboard';

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Comprovem seguretat (que no ens treguin de la web)
  const finalRedirect = next.startsWith('/') ? next : '/dashboard';

  revalidatePath('/', 'layout');
  // ✅ 2. Redirigim a la invitació!
  redirect(finalRedirect);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  // ✅ 1. Llegim el camp 'next'
  const next = (formData.get('next') as string) || '/dashboard';

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const finalRedirect = next.startsWith('/') ? next : '/dashboard';

  revalidatePath('/', 'layout');
  // ✅ 2. Redirigim a la invitació!
  redirect(finalRedirect);
}

// signOutAction es queda igual
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}