// Adicione os imports necessários no topo do arquivo
// ... seus imports existentes ...
import { redirect } from 'next/navigation';

export async function openMemedPanel(formData: FormData) {
    'use server';

    const userEmail = formData.get('email') as string;

    // Use a lógica para alternar entre homologação e produção, se necessário
    const isProduction = process.env.NODE_ENV === 'production';

    const memedApiUrl = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_API_URL_PRODUCTION!
        : process.env.NEXT_PUBLIC_MEMED_API_URL_HOMOLOGATION;

    const memedApiKey = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_API_KEY_PRODUCTION!
        : process.env.NEXT_PUBLIC_MEMED_API_KEY_HOMOLOGATION!;

    const memedSecretKey = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_PRODUCTION!
        : process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_HOMOLOGATION!;

    try {
        const response = await fetch(memedApiUrl + '/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': memedApiKey,
                'X-SECRET-KEY': memedSecretKey
            },
            body: JSON.stringify({
                'email': userEmail,
            })
        });

        // Verifique se a resposta é OK antes de tentar ler o JSON
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na requisição da Memed:', response.status, errorText);
            throw new Error('Falha ao abrir painel da Memed');
        }

        const data = await response.json();

        console.log('Usuário criado na Memed:', data);

        // Use o redirecionamento com a URL retornada
        if (data.memed_url) {
            redirect(data.memed_url);
        } else {
            console.error('URL da Memed não encontrada na resposta:', data);
            throw new Error('URL de redirecionamento da Memed não encontrada');
        }

    } catch (error) {
        console.error('Erro na requisição da Memed:', error);
        redirect('/error');
    }
}