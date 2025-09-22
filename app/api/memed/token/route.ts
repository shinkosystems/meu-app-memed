// Imports necessários para a rota de API do Next.js
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    // 1. Autenticação e Obtenção do Usuário Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Se não houver usuário logado, retorna um erro 401
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // 2. Acesso às Variáveis de Ambiente da Memed
    const memedApiUrl = process.env.NEXT_PUBLIC_MEMED_API_URL_HOMOLOGATION;
    const memedApiKey = process.env.NEXT_PUBLIC_MEMED_API_KEY_HOMOLOGATION;
    const memedSecretKey = process.env.NEXT_PUBLIC_MEMED_SECRET_KEY_HOMOLOGATION;

    if (!memedApiUrl || !memedApiKey || !memedSecretKey) {
        // Se as variáveis estiverem faltando, retorna um erro 500
        console.error("Missing Memed API environment variables");
        return NextResponse.json({ error: 'Missing Memed API environment variables' }, { status: 500 });
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
                        board_number: Math.floor(Math.random() * 900000) + 100000,
                        board_state: 'SP',
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
            return NextResponse.json({
                error: `API returned an error: ${response.status}`,
                details: errorText
            }, { status: 500 });
        }

        const data = await response.json();

        if (data.data?.attributes?.token) {
            const memedToken = data.data.attributes.token;
            // Retorna o token e os dados do paciente para o front-end
            return NextResponse.json({
                memedToken,
                patientId: user.id,
                patientName: user.user_metadata.full_name || 'Usuário de Exemplo',
                patientCpf: user.user_metadata.cpf || '',
            });
        } else {
            console.error('Erro na resposta da Memed: Token não encontrado', data);
            return NextResponse.json({ error: 'Failed to get Memed token from API' }, { status: 500 });
        }
    } catch (error) {
        console.error('Erro na requisição para a Memed:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}