'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function getMemedToken() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'User not authenticated' };
    }

    // Verifica se o ambiente de produção está ativo
    const isProduction = process.env.NODE_ENV === 'production';
    
    const baseUrl = isProduction
        ? process.env.MEMED_API_BASE_URL + '/sinapse-prescricao/usuarios' // Ou o nome que você usou para a URL de produção
        : process.env.MEMED_API_BASE_URL + '/sinapse-prescricao/usuarios';

    const apiKey = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_API_KEY_PRODUCTION!
        : process.env.NEXT_PUBLIC_MEMED_API_KEY_HOMOLOGATION!;

    const secretKey = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_PRODUCTION!
        : process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_HOMOLOGATION!;

    const url = new URL(baseUrl);
    url.searchParams.append('api-key', apiKey);
    url.searchParams.append('secret-key', secretKey);

    const payload = {
        data: {
            type: 'usuarios',
            attributes: {
                external_id: uuidv4(),
                nome: 'Nome de Exemplo',
                sobrenome: 'Sobrenome de Exemplo',
                board: {
                    board_code: 'CRM',
                    board_number: Math.floor(Math.random() * 900000) + 100000,
                    board_state: 'SP',
                },
            },
        },
    };

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.api+json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.data?.attributes?.token) {
            console.log('Usuário cadastrado na Memed:', data);
            return { token: data.data.attributes.token };
        } else {
            console.error('Erro na resposta da Memed:', data);
            return { error: 'Failed to get Memed token' };
        }
    } catch (error) {
        console.error('Erro na requisição para a Memed:', error);
        return { error: 'Failed to get Memed token' };
    }
}