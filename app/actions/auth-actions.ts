// =================== FILE: src/app/actions/auth-actions.ts ===================
'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Obtenim el 'next' i el sanegem
  const nextRaw = formData.get('next') as string;
  const next = nextRaw || '/dashboard';

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Retornem l'error sense fer redirect (millor UX)
    return { error: error.message };
  }

  // 🛡️ SECURITY CHECK: Evitem Open Redirects
  // Només redirigim si la ruta comença per '/' (és interna)
  // Si algú intenta ?next=http://malicious.com, el forcem a /dashboard
  const finalRedirect = next.startsWith('/') ? next : '/dashboard';

  revalidatePath('/', 'layout');
  redirect(finalRedirect);
}

export async function signup(formData: FormData) {
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