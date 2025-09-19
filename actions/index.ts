'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await (await supabase).auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Erro de Login:', error.message);
        redirect('/error');
    }

    redirect('/account');
}

export async function handleSignUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await (await supabase).auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Erro de Cadastro:', error.message);
        redirect('/error');
    }

    redirect('/account');
}

export async function handleLogout() {
    'use server';
    const supabase = createClient();
    await (await supabase).auth.signOut();
    redirect('/');
}