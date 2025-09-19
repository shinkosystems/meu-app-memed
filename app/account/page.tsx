// app/account/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getMemedToken } from '@/actions/memed';
import MemedPanel from '@/components/MemedPanel'; // O componente que injeta o script

export default async function Account() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { token, error } = await getMemedToken();

    if (error) {
        redirect('/error');
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
                <main className="flex-1 flex flex-col gap-6">
                    <h2 className="font-bold text-4xl mb-4">
                        Bem-vindo, {user.email}!
                    </h2>
                    {/* Renderiza o componente que irá carregar o painel da Memed */}
                    {token && <MemedPanel token={token} />}
                    {/* Este é o contêiner onde o painel da Memed será renderizado. */}
                    <div id="memed-container" className="mt-8"></div>
                </main>
            </div>
        </div>
    );
}