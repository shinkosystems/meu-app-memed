'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-red-100">
            <h2 className="text-3xl font-bold mb-4 text-red-700">Algo deu errado!</h2>
            <button
                onClick={() => reset()}
                className="p-3 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition-colors"
            >
                Tente Novamente
            </button>
        </div>
    );
}