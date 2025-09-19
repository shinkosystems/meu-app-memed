'use client';

import { useEffect } from 'react';

// Define um tipo para o módulo Memed para evitar o uso de 'any'
type MemedModule = {
    name: string;
};

// Declaração de tipos para as variáveis globais da Memed
declare global {
    interface Window {
        MdSinapsePrescricao: {
            event: {
                add: (eventName: string, callback: (module: MemedModule) => void) => void;
            };
        };
        MdHub: {
            module: {
                show: (moduleName: string) => void;
            };
        };
    }
}

export default function MemedPanel({ token }: { token: string }) {
    useEffect(() => {
        if (!token) return;

        const scriptUrl = 'https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js';

        if (document.querySelector(`script[src="${scriptUrl}"]`)) {
            return;
        }

        const script = document.createElement('script');
        script.src = scriptUrl;
        script.dataset.token = token;

        script.addEventListener('load', () => {
            const MdSinapsePrescricao = window.MdSinapsePrescricao;
            const MdHub = window.MdHub;

            if (MdSinapsePrescricao) {
                MdSinapsePrescricao.event.add('core:moduleInit', (module: MemedModule) => {
                    if (module.name === 'plataforma.prescricao') {
                        MdHub.module.show('plataforma.prescricao');
                    }
                });
            }
        });

        document.body.appendChild(script);

        return () => {
            const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, [token]);

    return null;
}