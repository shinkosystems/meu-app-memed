'use client';

import { useEffect } from 'react';

export default function MemedPanel({ token }) {
    useEffect(() => {
        if (!token) return;

        // URL do script da Memed para o painel de prescrições
        const scriptUrl = 'https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js';

        // Verifica se o script já foi carregado para evitar duplicação
        if (document.querySelector(`script[src="${scriptUrl}"]`)) {
            return;
        }

        // Cria um novo elemento de script
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.dataset.token = token;

        // Adiciona o evento de 'load' para executar o comando
        script.addEventListener('load', () => {
            // Certifica-se de que o MdSinapsePrescricao está disponível globalmente
            if (typeof (window as any).MdSinapsePrescricao !== 'undefined') {
                // Espera o evento de inicialização do módulo
                (window as any).MdSinapsePrescricao.event.add('core:moduleInit', (module: any) => {
                    if (module.name === 'plataforma.prescricao') {
                        // Envia o comando para mostrar o painel no contêiner
                        (window as any).MdHub.module.show('plataforma.prescricao');
                    }
                });
            }
        });

        // Adiciona o script ao body do documento
        document.body.appendChild(script);

        // Retorna uma função de limpeza para remover o script
        return () => {
            const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, [token]);

    return null; // Este componente não renderiza nada diretamente
}