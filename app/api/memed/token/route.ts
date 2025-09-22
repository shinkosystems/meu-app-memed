// app/api/memed/token/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    // CORRIGIDO: Adicione o 'await' aqui para esperar a criação do cliente
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // ... o restante do seu código aqui ...
    const memedApiUrl = process.env.NEXT_PUBLIC_MEMED_API_URL_HOMOLOGATION;
    const memedApiKey = process.env.NEXT_PUBLIC_MEMED_API_KEY_HOMOLOGATION;
    const memedSecretKey = process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_HOMOLOGATION;

    if (!memedApiUrl || !memedApiKey || !memedSecretKey) {
        return NextResponse.json({ error: 'Missing Memed API environment variables' }, { status: 500 });
    }

    // ... o restante da sua lógica
    try {
        const payload = {
            data: {
                type: 'usuarios',
                attributes: {
                    external_id: user.id,
                    nome: user.user_metadata.full_name || 'Nome de Exemplo',
                    board: {
                        board_code: 'CRM',
                        board_number: Math.floor(Math.random() * 900000) + 100000,
                        board_state: 'SP',
                    },
                },
            },
        };

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

        const data = await response.json();

        if (response.ok && data.data?.attributes?.token) {
            const memedToken = data.data.attributes.token;
            return NextResponse.json({
                memedToken,
                patientId: user.id,
                patientName: user.user_metadata.full_name || 'Nome de Exemplo',
                patientCpf: user.user_metadata.cpf || '12345678900',
            });
        } else {
            console.error('Erro na resposta da Memed:', data);
            return NextResponse.json({ error: 'Failed to get Memed token from API' }, { status: 500 });
        }
    } catch (error) {
        console.error('Erro na requisição para a Memed:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}