'use client';

import { useEffect } from 'react';

// Define um tipo para o módulo Memed para evitar o uso de 'any'
type MemedModule = {
    name: string;
};

// Define um tipo para o objeto global MdHub
declare global {
    interface Window {
        MdSinapsePrescricao: any; // Usamos 'any' aqui pois é uma variável global
        MdHub: any; // Usamos 'any' aqui pois é uma variável global
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