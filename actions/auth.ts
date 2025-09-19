// Adicione os imports necessários no topo do arquivo
// ... seus imports existentes ...
import { redirect } from 'next/navigation';

export async function openMemedPanel(formData: FormData) {
    'use server';

    const userEmail = formData.get('email') as string;

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_MEMED_API_URL_HOMOLOGATION + '/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.NEXT_PUBLIC_MEMED_API_KEY_HOMOLOGATION!,
                'X-SECRET-KEY': process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_HOMOLOGATION!
            },
            body: JSON.stringify({
                'email': userEmail,
                // Você pode precisar adicionar mais dados aqui, como 'name' ou 'document'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Usuário criado na Memed:', data);
            // Aqui você vai receber uma URL de retorno para abrir o painel da Memed
            redirect(data.memed_url); // Exemplo de como redirecionar para a URL
        } else {
            console.error('Erro ao criar usuário na Memed:', data);
            throw new Error('Falha ao abrir painel da Memed');
        }

    } catch (error) {
        console.error('Erro na requisição da Memed:', error);
        redirect('/error');
    }
}