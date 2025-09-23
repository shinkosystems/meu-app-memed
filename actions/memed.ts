// actions/memed.ts

'use server';

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function getMemedToken() {
    // 1. Autenticação e Obtenção do Usuário Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { token: null, error: 'User not authenticated' };
    }

    // 2. Acesso às Variáveis de Ambiente da Memed
    const isProduction = process.env.NODE_ENV === 'production';

    const memedApiUrl = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_API_URL_PRODUCTION
        : process.env.NEXT_PUBLIC_MEMED_API_URL_HOMOLOGATION;

    const memedApiKey = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_API_KEY_PRODUCTION
        : process.env.NEXT_PUBLIC_MEMED_API_KEY_HOMOLOGATION;

    const memedSecretKey = isProduction
        ? process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_PRODUCTION
        : process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_HOMOLOGATION;


    if (!memedApiUrl || !memedApiKey || !memedSecretKey) {
        console.error("Missing Memed API environment variables");
        return { token: null, error: 'Missing Memed API environment variables' };
    }

    try {
        // 3. Montagem do Payload para a Requisição da Memed
        const payload = {
            data: {
                type: 'usuarios',
                attributes: {
                    external_id: user.id,
                    nome: user.user_metadata.full_name || 'Usuário de Exemplo',
                    board: {
                        board_code: 'CRM',
                        board_number: user.user_metadata.crm, // Usando o CRM do Supabase
                        board_state: user.user_metadata.crm_state, // Usando o estado do CRM do Supabase
                    },
                },
            },
        };

        // 4. Requisição à API da Memed
        const response = await fetch(`${memedApiUrl}/sinapse-prescricao/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.api+json',
                'X-API-KEY': memedApiKey,
                'X-SECRET-KEY': memedSecretKey,
            },
            body: JSON.stringify(payload),
        });

        // 5. Tratamento da Resposta
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na requisição da Memed:', response.status, errorText);
            return { token: null, error: 'Failed to get Memed token from API' };
        }

        const data = await response.json();

        if (data.data?.attributes?.token) {
            const memedToken = data.data.attributes.token;
            return { token: memedToken, error: null };
        } else {
            console.error('Erro na resposta da Memed: Token não encontrado', data);
            return { token: null, error: 'Failed to get Memed token from API' };
        }
    } catch (error) {
        console.error('Erro na requisição para a Memed:', error);
        return { token: null, error: 'An unexpected error occurred' };
    }
}